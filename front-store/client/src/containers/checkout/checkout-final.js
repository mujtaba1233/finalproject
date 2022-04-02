import React, { Component } from 'react';
import { connect } from 'react-redux';
import CartDetail from '../../components/cart-detail';
import { TO_CHECKOUT_USER_DETAIL, TO_CUSTOMER_ORDERS, TO_CHECKOUT_BILLING_ADDRESS } from '../../helpers/routesConstants';
import store from '../../store';
import { placeOrder, getOrders } from '../../actions/orderAction';
import { PREPARE_ORDER, ORDER_PLACED, EMPTY_CART, ORDER_ERRORED, ORDER_PROCESS } from '../../helpers/actionConstants';
import { cartSubTotal, cartTotal, totalShipping, totalTax } from '../../actions/globalActions';
import { getOptionIds, parseOptions, roundTo2Decimals } from '../../helpers/utility';
class CheckoutConfirmContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orderPlaced: false
        }
    }
    placeOrderHandle(e) {
        store.dispatch({ type: ORDER_PROCESS, payload: true })
        let orderObj = this.props.orderToBePlace;
        orderObj.PaymentAmount = (roundTo2Decimals(parseFloat(this.props.global.cartSubTotal) + parseFloat(orderObj.TotalShippingCost) + parseFloat(this.props.global.totalTax))) ? roundTo2Decimals(parseFloat(this.props.global.cartSubTotal) + parseFloat(orderObj.TotalShippingCost) + parseFloat(this.props.global.totalTax)) : 0;
        orderObj.Total_Payment_Authorized = orderObj.PaymentAmount ? roundTo2Decimals(parseFloat(orderObj.PaymentAmount)) : 0;
        orderObj.Total_Payment_Received = 0
        orderObj.OrderDate = new Date();
        orderObj.Affiliate_Commissionable_Value = roundTo2Decimals(parseFloat(this.props.global.cartSubTotal));
        orderObj.LastModified = new Date();
        orderObj.LastModBy = orderObj.CustomerID;
        orderObj.SalesTaxRate1 = parseFloat(this.props.global.taxRate * 100).toFixed(4);
        orderObj.SalesTax1 = roundTo2Decimals(parseFloat(this.props.global.totalTax * 100));
        orderObj.ShipResidential = "N";
        orderObj.UserId = orderObj.CustomerID;
        orderObj.Tax1_Title = "Tax (" + this.props.global.taxRate * 100 + "%)";
       
        orderObj.OrderSerials = "";
        orderObj.IsCustomerNameShow = true;
        orderObj.IsCustomerEmailShow = true;
        orderObj.IsAGift = "N";
        orderObj.IsGTSOrder = false;
        orderObj.OrderStatus = "New";
        orderObj.PaymentMethodID = 5;
        orderObj.Printed = "N";
        orderObj.SalesRep_CustomerID = orderObj.CustomerID;
        orderObj.Shipped = "N";
        orderObj.Stock_Priority = 3;
        orderObj.Order_Entry_System = "ONLINE";
        orderObj.Order_Type = "Customer";
        orderObj.QuoteNo = 0;
        orderObj.OrderDetails = []
        this.props.cartItems.forEach(elem => {
            orderObj.OrderDetails.push({
                FreeShippingItem: "N",
                OnOrder_Qty: 0,
                ProductWeight: elem.ProductWeight,
                QtyOnBackOrder: 0,
                QtyOnPackingSlip: 0,
                QtyShipped: 0,
                ShipDate: new Date(),
                ProductSerials: "",
                isChild: false,
                TaxableProduct: "Y",
                ProductCode: elem.ProductCode,
                ProductID: elem.ProductID,
                Quantity: elem.Quantity,
                TotalPrice: roundTo2Decimals(elem.ProductPrice * elem.Quantity),
                DiscountValue: elem.Discount,
                ProductName: elem.ProductName,
                ProductPrice: elem.ProductPrice,
                Discription: elem.ProductDescriptionShort,
                parentName: elem.ProductCode,
                OptionIDs: getOptionIds(elem.SelectedOptions),
                Options: parseOptions(elem.SelectedOptions),
            })
            elem.Childs.forEach(child => {
                orderObj.OrderDetails.push({
                    FreeShippingItem: "N",
                    OnOrder_Qty: 0,
                    ProductWeight: child.ProductWeight,
                    QtyOnBackOrder: 0,
                    QtyOnPackingSlip: 0,
                    QtyShipped: 0,
                    ShipDate: new Date(),
                    ProductSerials: "",
                    isChild: true,
                    TaxableProduct: "Y",
                    ProductCode: child.ProductCode,
                    ProductID: child.ProductID,
                    Quantity: child.Quantity,
                    TotalPrice: roundTo2Decimals(child.ProductPrice * child.Quantity)   ,
                    DiscountValue: 0,
                    ProductName: child.ProductName,
                    ProductPrice: child.ProductPrice,
                    Discription: child.ProductDescriptionShort,
                    OptionIDs:'',
                    Options:'',
                    parent: child.parent,
                })
            });
        });
        // delete orderObj.EmailAddress
        store.dispatch({ type: PREPARE_ORDER, payload: orderObj });
        store.dispatch({ type: ORDER_ERRORED, payload: {} });
        store.dispatch(placeOrder(orderObj))
    }
    componentDidMount() {
        window.onbeforeunload = function () {
            return "are you sure?";
        };
    }
    componentDidUpdate(prevProps) {
        if (prevProps.isLoggedIn !== this.props.isLoggedIn && !this.props.isLoggedIn) {
            this.props.history.push(TO_CHECKOUT_BILLING_ADDRESS)
        }
        if (!this.props.orderToBePlace.CustomerID) {
            let thisObj = this;
            setTimeout(() => {
                thisObj.props.history.push(TO_CHECKOUT_BILLING_ADDRESS);
            }, 0);
        }
        if (this.props.global.orderPlaced) {
            store.dispatch(getOrders({ CustomerID: parseInt(this.props.orderToBePlace.CustomerID) }));
            store.dispatch({ type: ORDER_PLACED, payload: false });
            store.dispatch(cartSubTotal(0))
            store.dispatch(cartTotal(0));
            store.dispatch(totalShipping(0));
            store.dispatch(totalTax(0));
            this.setState({ orderPlaced: true })
            var thisObj = this;
            setTimeout(() => {
                // store.dispatch({type:PREPARE_ORDER,payload:{}});
                store.dispatch({ type: EMPTY_CART, payload: [] });
                thisObj.props.history.push(TO_CUSTOMER_ORDERS)
            }, 500);
        }
    }
    render() {
        return (
            <div id="content">
                <div className="container">
                    <CartDetail containerRef={this} orderPlaceHandler={this.placeOrderHandle} finalOrderView={true} />
                </div>
            </div>
        );
    }
}

const stateMap = (state) => {


    return {
        orderToBePlace: state.order.orderToBePlace,
        isLoggedIn: state.global.isLoggedIn,
        global: state.global,
        cartItems: state.cart,
    };
};

export default connect(stateMap)(CheckoutConfirmContainer);
