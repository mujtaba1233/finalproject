import React, { Component } from 'react';
import Payment from 'payment';
import { connect } from 'react-redux';
import { placeOrder, getOrders } from '../../actions/orderAction';
import OrderSummary from '../../components/order-summary';
import { Link } from 'react-router-dom'
import { TO_CHECKOUT_SHIPPING, TO_CUSTOMER_ORDERS, TO_CHECKOUT_CONFIRM, TO_CHECKOUT_USER_DETAIL, TO_CHECKOUT_PAYMENT, TO_CHECKOUT_BILLING_ADDRESS } from '../../helpers/routesConstants';
import { checkCartForFreeShipping, formatCreditCardNumber, formatCVC, formatExpirationDate, getOptionIds, parseOptions, roundTo2Decimals } from '../../helpers/utility';
import NavLink from 'react-router-dom/NavLink';
import Cards from 'react-credit-cards';
import Input from 'react-validation/build/input';
import Form from 'react-validation/build/form';
import 'react-credit-cards/es/styles-compiled.css';
import { required, cardNo, validCard, cardExpiry, cardCVC } from '../../helpers/form-validation';
import { PREPARE_ORDER, ORDER_PLACED, EMPTY_CART, ORDER_ERRORED, ORDER_PROCESS } from '../../helpers/actionConstants';
import { cartSubTotal, cartTotal, totalShipping, totalTax } from '../../actions/globalActions';
import store from '../../store';
import Scroll from 'react-scroll';
import { API_LOGIN, API_PUBLIC_KEY } from '../../helpers/constants';
import Loader from "../../components/Loader";
import { removeItem } from '../../actions/cartActions';
class CheckoutPaymentContainer extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.myFunction = this.myFunction.bind(this);
        this.callbackHandle = this.callbackHandle.bind(this);
        this.sendPaymentDataToAnet = this.sendPaymentDataToAnet.bind(this);
        this.acceptPaymentResponsehandler = this.acceptPaymentResponsehandler.bind(this);
        this.state = {
            orderPlaced: false,
            paymentInfo: {
                number: '',
                name: '',
                expiry: '',
                cvc: '',
            },
            orderRes: {},
            focused: 'number',
            inProcess: false,
            errorMessage: null,
            IsFreeProduct:checkCartForFreeShipping()
        }
    }
    // onErrorHandler = (response) => {
    //     this.setState({
    //         status: ["failure", response.messages.message.map(err => err.text)]
    //     });
    // };
    placeOrderHandle(e) {
        // console.log(this.state.inProcess);
        if(e)
        e.preventDefault();

        store.dispatch({ type: ORDER_PROCESS, payload: true })
        let orderObj = this.props.orderToBePlace;
        orderObj.PaymentAmount = (roundTo2Decimals(parseFloat(this.props.global.cartSubTotal) + parseFloat(orderObj.TotalShippingCost) + parseFloat(this.props.global.totalTax))) ? roundTo2Decimals(parseFloat(this.props.global.cartSubTotal) + parseFloat(orderObj.TotalShippingCost) + parseFloat(this.props.global.totalTax)) : 0 ;
        orderObj.Total_Payment_Authorized = orderObj.PaymentAmount ? roundTo2Decimals(parseFloat(orderObj.PaymentAmount)) : 0;
        orderObj.Total_Payment_Received = 0
        orderObj.OrderDate = new Date();
        orderObj.Affiliate_Commissionable_Value = roundTo2Decimals(parseFloat(this.props.global.cartSubTotal));
        orderObj.LastModified = new Date();
        orderObj.LastModBy = orderObj.CustomerID;
        orderObj.SalesTaxRate1 = parseFloat(this.props.global.taxRate).toFixed(4);
        orderObj.SalesTax1 = roundTo2Decimals(parseFloat(this.props.global.totalTax));
        orderObj.ShipResidential = "N";
        orderObj.UserId = orderObj.CustomerID;
        orderObj.Tax1_Title = "Tax (" + this.props.global.taxRate + "%)";

        orderObj.OrderSerials = "";
        orderObj.IsCustomerNameShow = true;
        orderObj.IsCustomerEmailShow = true;
        orderObj.IsAGift = "N";
        orderObj.IsFreeOrder = checkCartForFreeShipping()?1:0
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
                    TotalPrice: roundTo2Decimals(child.ProductPrice * child.Quantity),
                    DiscountValue: 0,
                    ProductName: child.ProductName,
                    ProductPrice: child.ProductPrice,
                    Discription: child.ProductDescriptionShort,
                    OptionIDs: '',
                    Options: '',
                    parent: child.parent,
                })
            });
        });
        // delete orderObj.EmailAddress
        store.dispatch({ type: PREPARE_ORDER, payload: orderObj });
        store.dispatch({ type: ORDER_ERRORED, payload: {} });
        store.dispatch(placeOrder(orderObj))
    }
    // onSuccessHandler = (response) => {
    //     // Process API response on your backend...
    //     this.setState({ status: ["failure", response] });
    //     var orderObj = this.props.orderToBePlace
    //     orderObj.opaqueData = this.state.status[1].opaqueData
    //     store.dispatch({ type: PREPARE_ORDER, payload: orderObj });
    //     // this.props.history.push(TO_CHECKOUT_CONFIRM);
    //     this.placeOrderHandle();
    //     // console.log(this.state.status)

    // };
    
    handleUpdateSubmit = (event) => {
        event.preventDefault();
        this.form.validateAll();

        if (this.form.getChildContext()._errors.length === 0) {
            this.sendPaymentDataToAnet()
        }
    }
    sendPaymentDataToAnet() {

        this.setState({ inProcess: true, errorMessage: null, orderRes: {} })
        // this.setState({ errorMessage: null })
        let authData = {};
        // authData.clientKey = "46gk36Be6QJ76ByU3NZjpdMZqJeUJyM962Wc3Q86kyg3d3sTCqT3uN2g7UtjWcZF";
        // authData.apiLoginID = "3xS98PkAb2x";
        authData.clientKey = API_PUBLIC_KEY;
        authData.apiLoginID = API_LOGIN;

        let cardData = {};
        cardData.cardNumber = this.state.paymentInfo.number.replace(/\s/g, '');
        // $scope.cardData.expiry =  $scope.card.expiry;
        cardData.month = this.state.paymentInfo.expiry.slice(0, 2);
        cardData.year = '20' + this.state.paymentInfo.expiry.slice(3, 5);
        cardData.cardCode = this.state.paymentInfo.cvc;

        let secureData = {};
        secureData.authData = authData;
        secureData.cardData = cardData;

        window.Accept.dispatchData(secureData, this.acceptPaymentResponsehandler);

    }
    acceptPaymentResponsehandler(response) {
        if (response.messages.resultCode === "Error") {
            console.log('Error: ', response);
            this.setState({ inProcess: false, errorMessage: response.messages.message[0].text })
        } else {
            console.log(response,"responseHandler");
            try {
                var orderObj = this.props.orderToBePlace
                orderObj.opaqueData = response.opaqueData
                store.dispatch({ type: PREPARE_ORDER, payload: orderObj });
                this.placeOrderHandle();
            } catch (error) {
                console.log('errorerror',error);
            }
        }
    }
    componentDidMount() {
        Scroll.animateScroll.scrollToTop();

        window.onbeforeunload = function (event) {
            return 'are you sure';
        };
        Payment.removeFromCardArray('dankort');
        Payment.removeFromCardArray('discover');
        Payment.removeFromCardArray('hipercard');
        Payment.removeFromCardArray('dinersclub');
        Payment.removeFromCardArray('jcb');
        Payment.removeFromCardArray('laser');
        Payment.removeFromCardArray('maestro');
        Payment.removeFromCardArray('unionpay');
        Payment.removeFromCardArray('visaelectron');
        Payment.removeFromCardArray('elo');
        // console.log(Payment.getCardArray())
        let cards = [
            {
                cvcLength: 4,
                format: /(\d{1,4})(\d{1,6})?(\d{1,5})?/,
                length: 15,
                luhn: true,
                pattern: /^3[47]/,
                type: 'amex'

            },
            {
                cvcLength: 3,
                format: /(\d{1,4})/g,
                length: [16],
                luhn: true,
                pattern: /^5[0-5]/,
                type: 'mastercard'

            },
            {
                cvcLength: 3,
                format: /(\d{1,4})/g,
                length: [13, 16, 19],
                luhn: true,
                pattern: /^4/,
                type: 'visa'

            }

        ]
        // console.log(cards)
        Payment.setCardArray(cards)
        // console.log(Payment.getCardArray())

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
            this.props.orderToBePlace.OrderDetails.map(({ ProductCode }) => {
                store.dispatch(removeItem({ ProductCode }));
            })
            this.setState({ orderPlaced: true })
            var thisObj = this;
            // store.dispatch({type:PREPARE_ORDER,payload:{}});
            store.dispatch({ type: EMPTY_CART, payload: [] });
            window.onbeforeunload = null;
            window.location.pathname = TO_CUSTOMER_ORDERS
            // thisObj.props.history.push(TO_CUSTOMER_ORDERS)
        }
        if (!this.props.orderProcess && this.props.orderProcess !== prevProps.orderProcess) {
            // console.log(this.props.orderProcess);
            this.setState({ inProcess: false })
        }
        if (this.props.orderPlaceError && this.props.orderPlaceError.code !== prevProps.orderPlaceError.code) {
            let orderToBePlace = this.props.orderToBePlace;
            this.setState({ orderRes: this.props.orderPlaceError })
            if (this.props.orderPlaceError.result && this.props.orderPlaceError.result.result && this.props.orderPlaceError.result.result.orderId) {
                orderToBePlace.OrderID = this.props.orderPlaceError.result.result.orderId
                store.dispatch({ type: PREPARE_ORDER, payload: orderToBePlace });
            }

        }
    }
    handleChange(event) {
        let paymentInfo = { ...this.state.paymentInfo };
        if (event.target.name === 'number') {
            event.target.value = formatCreditCardNumber(event.target.value);
        } else if (event.target.name === 'expiry') {
            event.target.value = formatExpirationDate(event.target.value);
        } else if (event.target.name === 'cvc') {
            event.target.value = formatCVC(event.target.value);
        }
        paymentInfo[event.target.name] = event.target.value;
        this.setState({ paymentInfo });
        this.setState({ focused: event.target.name })
    }
    myFunction(event) {
        // console.log(event.key)
        // var x = event.keyCode;
        if (!(event.key >= 0 && event.key <= 9)) {
            event.preventDefault();
        }
    }
    callbackHandle(type, isValid) {
        // console.log(type, isValid);

        // let paymentInfo = { ...this.state.paymentInfo };
        // paymentInfo[event.target.name] = event.target.value;
        // this.setState({ paymentInfo });
        // this.setState({ focused: event.target.name })
    }
    render() {
        let cartTotal = this.props.global.cartTotal;
        return (
            <div id="content">
                <div className="container">
                    <div className="row">
                        <div id="checkout" className="col-lg-9">
                            <div className="box">
                                <ul className="nav nav-pills nav-fill">
                                    <li className="nav-item"><NavLink to={TO_CHECKOUT_BILLING_ADDRESS} activeClassName='active' className="nav-link"> <i className="fa fa-address-card"></i><br></br>Billing Address</NavLink></li>
                                    <li className="nav-item"><NavLink to={TO_CHECKOUT_USER_DETAIL} activeClassName='active' className="nav-link"> <i className="fa fa-map-marker"></i><br></br>Shipping Address</NavLink></li>
                                   {!this.state.IsFreeProduct &&  <li className="nav-item"><NavLink to={TO_CHECKOUT_SHIPPING} activeClassName='active' className="nav-link"><i className="fa fa-truck"></i><br></br>Delivery Method</NavLink></li>}
                                    <li className="nav-item"><NavLink to={TO_CHECKOUT_CONFIRM} className="nav-link"><i className="fa fa-eye"></i><br></br>Order Review</NavLink></li>
                                    <li className="nav-item"><NavLink to={TO_CHECKOUT_PAYMENT} activeClassName='active' className="nav-link"><i className="fa fa-money"></i><br></br>Payment Method</NavLink></li>
                                </ul>
                                {/* <FormContainer
                                    environment="sandbox"
                                    onError={this.onErrorHandler}
                                    onSuccess={this.onSuccessHandler}
                                    amount={parseFloat(cartTotal).toFixed(2)}
                                    component={FormComponent}
                                    clientKey={'46gk36Be6QJ76ByU3NZjpdMZqJeUJyM962Wc3Q86kyg3d3sTCqT3uN2g7UtjWcZF'}
                                    apiLoginId={'3xS98PkAb2x'}
                                /> */}
                                {/* <div className="row mgTp30">
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                            <Link to={TO_CHECKOUT_SHIPPING} className="btn btn-secondary mt-0"><i className="fa fa-chevron-left"></i>Back to delivery method</Link>
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                        <Link to={TO_CHECKOUT_CONFIRM}><button type="submit" className="btn btn-template-outlined pull-right">Review Order <i className="fa fa-chevron-right"></i></button></Link>
                                        </div>
                                    </div> */}
                                {(this.state.inProcess && <Loader />)}
                                {(!this.state.inProcess && !this.state.IsFreeProduct &&
                                    <Form ref={c => { this.form = c }} onSubmit={this.handleUpdateSubmit.bind(this)}>
                                        <div className="content">
                                            <div className="row">
                                                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-16">
                                                    <Cards
                                                        number={this.state.paymentInfo.number}
                                                        name={this.state.paymentInfo.name}
                                                        expiry={this.state.paymentInfo.expiry}
                                                        cvc={this.state.paymentInfo.cvc}
                                                        focused={this.state.focused}
                                                        callback={this.callbackHandle}
                                                    />
                                                </div>
                                                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-16 form-group">
                                                    <div className="row">
                                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-16 form-group">
                                                            <Input validations={[required, validCard]} onKeyPress={this.myFunction} maxLength="19" className="form-control" type="tel" name="number" value={this.state.paymentInfo.number} onFocus={this.handleChange} onChange={this.handleChange} placeholder="Card Number"></Input>
                                                            <small className="form-text text-muted">We only accept: VISA, MASTER CARD, AMERICAN EXPRESS</small>
                                                        </div>
                                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-16 form-group">
                                                            <Input validations={[required]} className="form-control" type="text" name="name" value={this.state.paymentInfo.name} onFocus={this.handleChange} onChange={this.handleChange} placeholder="Name"></Input>
                                                        </div>
                                                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 form-group">
                                                            <Input validations={[required, cardExpiry]} className="form-control" pattern="\d\d/\d\d" type="tel" name="expiry" value={this.state.paymentInfo.expiry} onFocus={this.handleChange} onChange={this.handleChange} placeholder="MM/YY"></Input>
                                                        </div>
                                                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 form-group">
                                                            <Input validations={[required, cardCVC]} className="form-control" pattern="\d{3,4}" type="tel" name="cvc" value={this.state.paymentInfo.cvc} onFocus={this.handleChange} onChange={this.handleChange} placeholder="CVC"></Input>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row mgTp30">
                                            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                                <Link to={TO_CHECKOUT_CONFIRM} className="btn btn-secondary mt-0"><i className="fa fa-chevron-left"></i> Back to order review</Link>
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                                <button disabled={this.state.inProcess} type="submit" className="btn btn-template-outlined pull-right">Place Order </button>
                                            </div>
                                        </div>
                                    </Form>
                                )}
                                {this.state.IsFreeProduct && 
                                 <Form ref={c => { this.form = c }} onSubmit={this.placeOrderHandle.bind(this)}>

                                    <div className="content">
                                        <label>This order is free so no payment method needed</label>
                                    </div>
                                    <div className="row mgTp30">
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                            <Link to={TO_CHECKOUT_CONFIRM} className="btn btn-secondary mt-0"><i className="fa fa-chevron-left"></i> Back to order review</Link>
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                            <button disabled={this.state.inProcess} type="submit" className="btn btn-template-outlined pull-right">Place Order </button>
                                        </div>
                                    </div>
                                </Form>
                                }
                                {(this.state.errorMessage && <div className="alert alert-danger">
                                    <strong>Error!</strong> <span>{this.state.errorMessage}</span>
                                </div>
                                )}
                                {(this.props.global.orderPlaced && <div className="alert alert-success">
                                    <strong>Success!</strong> <span>Order has been placed successfully.</span>
                                </div>
                                )}
                                {(this.state.orderRes.code === 400 && this.state.orderRes.result.payment && <div className="alert alert-danger">
                                    <strong>Error!</strong> <span>{this.state.orderRes.result.payment.errorMessage}</span>
                                </div>
                                )}
                                {(this.state.orderRes.code === 400 && this.state.orderRes.result.payment && this.state.orderRes.result.payment.errorCode === "65" && <div className="alert alert-danger">
                                    <strong>Error!</strong> <span>Invalid billing address or credit card details.</span>
                                </div>
                                )}
                                {/* <div className="row mgTp30">
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                            <Link to={TO_CHECKOUT_CONFIRM} className="btn btn-secondary mt-0"><i className="fa fa-chevron-left"></i> Back to order review</Link>
                                        </div>
                                </div> */}
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <OrderSummary showTaxAndShipping={true} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const stateMap = (state) => {
    return {
        orderToBePlace: state.order.orderToBePlace,
        orderProcess: state.order.orderProcess,
        isLoggedIn: state.global.isLoggedIn,
        orderPlaceError: state.global.orderPlaceError,
        global: state.global,
        cartItems: state.cart,
    };
};

export default connect(stateMap)(CheckoutPaymentContainer);
