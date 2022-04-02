import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import NumberFormat from 'react-number-format';
import CustomerSectionTabs from '../../components/customer-section-tabs'
import { DATE_FORMAT } from '../../helpers/constants';
import Link from 'react-router-dom/Link';
import { TO_STORE, TO_LOGIN, TO_CUSTOMER_ORDER_VIEW } from '../../helpers/routesConstants';
import { PREPARE_ORDER } from '../../helpers/actionConstants';
import store from '../../store';
var dateFormat = require('dateformat');
const OrderRows = ({ orders }) => (
    <Fragment>
        {(orders.length > 0 && orders.map(order => (
            <tr key={order.OrderID}>
                <th># {order.OrderID}</th>
                <td>{(order.OrderDate !== null && (dateFormat(order.OrderDate, DATE_FORMAT))) || 'N/A'}</td>
                <td>{order.PaymentAmount !== null && (<NumberFormat isNumericString={true} decimalScale={2} value={order.PaymentAmount} displayType={'text'} thousandSeparator={true} prefix={'$ '} />) || '$0.00'}</td>
                <td><span className=
                    {
                        (order.OrderStatus !== null && order.OrderStatus.toLowerCase() === 'cancelled' && "badge badge-danger") ||
                        (order.OrderStatus !== null && order.OrderStatus.toLowerCase() === 'returned' && "badge badge-danger") ||
                        (order.OrderStatus !== null && order.OrderStatus.toLowerCase() === 'new' && "badge badge-success") ||
                        (order.OrderStatus !== null && order.OrderStatus.toLowerCase() === 'partially shipped' && "badge badge-info") ||
                        (order.OrderStatus !== null && order.OrderStatus.toLowerCase() === 'shipped' && "badge badge-info") ||
                        (order.OrderStatus !== null && order.OrderStatus.toLowerCase() === 'backordered' && "badge badge-warning")
                    }
                >{order.OrderStatus || 'N/A'}</span></td>
                <td><Link to={TO_CUSTOMER_ORDER_VIEW + order.OrderID} className="btn btn-template-outlined btn-sm">View</Link></td>
            </tr>
        ))) || (
                <tr>
                    <th colSpan='5' className="text-center"> No orders found, go to <Link to={TO_STORE}>Store</Link> to place an order</th>
                </tr>
            )}
    </Fragment>
);
class CustomerOrderContainer extends Component {
    componentDidMount() {
        store.dispatch({type:PREPARE_ORDER,payload:{}});
    }
    componentDidUpdate(prevProps) {
        if (prevProps.isLoggedIn !== this.props.isLoggedIn && !this.props.isLoggedIn) {
            this.props.history.push(TO_LOGIN)
        }
    }
    render() {
        // console.log(this.props.orders)
        return (
            <div id="content">
                <div className="container">
                    <div className="row bar mb-0">
                        <div id="customer-orders" className="col-md-9">
                            <p className="text-muted lead">If you have any questions, please feel free to <a href="mailto:icscontactus@intrepidcs.com">contact us</a>, our customer service center is working for you 24/7.</p>
                            <div className="box mt-0 mb-lg-0">
                                <div className="table-responsive">
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>Order</th>
                                                <th>Date</th>
                                                <th>Total</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <OrderRows orders={this.props.orders} />
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 mt-4 mt-md-0">
                            <CustomerSectionTabs history={this.props.history} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const stateMap = (state) => {
    return {
        orders: state.order.orders,
        inProcess: state.global.inProcess,
        orderError: state.global.orderError,
        isLoggedIn: state.global.isLoggedIn,
    };
};

export default connect(stateMap)(CustomerOrderContainer);
