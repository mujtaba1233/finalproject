import React, { Component, Fragment } from 'react';
import NumberFormat from 'react-number-format';
import { connect } from 'react-redux';
import { doCartMath, roundTo2Decimals } from '../helpers/utility';
class OrderSummary extends Component {
    componentDidMount() {
        this.setState({ cartItems: this.props.cartItems ? this.props.cartItems : [] }, () => {
                doCartMath(this.state.cartItems,this.props.global.totalTax,this.props.global.totalShipping);
                // doCartMath(this.state.cartItems);
        })
    }
    componentDidUpdate(prevProps) {
        if (prevProps.cartItems.length !== this.props.cartItems.length) {
            this.setState({ cartItems: this.props.cartItems }, () => {
                doCartMath(this.state.cartItems,this.props.global.totalTax,this.props.global.totalShipping);
            })
        }
        if(JSON.stringify(prevProps.global) !== JSON.stringify(this.props.global)){
            doCartMath(this.state.cartItems,this.props.global.totalTax,this.props.global.totalShipping);
        }
    }
    render() {
        let cartSubTotal = this.props.global.cartSubTotal;
        let cartTotal = this.props.global.cartTotal;
        let totalShipping = this.props.global.totalShipping;
        let totalTax = this.props.global.totalTax
        return (
            <div id="order-summary" className={'box mb-4 p-0 ' + this.props.class}>
                <div className="box-header mt-0">
                    <h3>Order summary</h3>
                </div>
                <p className="text-muted">Shipping and taxes are calculated based on the shipping address.</p>
                <div className="table-responsive">
                    <table className="table">
                        <tbody>
                            <tr>
                                <td>Subtotal</td>
                                <th className="text-right"><NumberFormat isNumericString={true} decimalScale={2} value={roundTo2Decimals(parseFloat(cartSubTotal))} displayType={'text'} thousandSeparator={true} prefix={'$'} /></th>
                            </tr>
                            {this.props.showTaxAndShipping && (
                                <Fragment>
                                    <tr>
                                        <td>Shipping and handling</td>
                                        <th className="text-right"><NumberFormat isNumericString={true} decimalScale={2} value={roundTo2Decimals(parseFloat(totalShipping))} displayType={'text'} thousandSeparator={true} prefix={'$'} /></th>
                                    </tr>
                                    <tr>
                                        <td>Tax</td>
                                        <th className="text-right"><NumberFormat isNumericString={true} decimalScale={3} value={roundTo2Decimals(parseFloat(totalTax))} displayType={'text'} thousandSeparator={true} prefix={'$'} /></th>
                                    </tr>
                                </Fragment>
                            )}
                            <tr className="total">
                                <td>Total</td>
                                <th className="text-right"><NumberFormat isNumericString={true} decimalScale={2} value={roundTo2Decimals(parseFloat(cartTotal))} displayType={'text'} thousandSeparator={true} prefix={'$'} /></th>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

const stateMapQuantityBar = (state) => {
    return {
        global: state.global,
        cartItems: state.cart,
    };
};

export default connect(stateMapQuantityBar)(OrderSummary);