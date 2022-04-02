import React, { Component } from 'react';

import { NavLink  } from 'react-router-dom'
import LogoutButton from './logout-button'
import { TO_CUSTOMER_ACCOUNT, TO_CUSTOMER_ORDERS, TO_CHANGE_PASSWORD, TO_RETURN } from '../helpers/routesConstants';

export default class CustomerSectionTabs extends Component {
    render() {
        return (
            <div className="panel panel-default sidebar-menu customer-section-tabs">
                <div className="panel-heading">
                    <h3 className="h4 panel-title">Customer section</h3>
                </div>
                <div className="panel-body">
                    <ul className="nav nav-pills flex-column text-sm">
                        <li className="nav-item"><NavLink activeClassName='active' to={TO_CUSTOMER_ACCOUNT} className="nav-link"><i className="fa fa-user"></i> My Account</NavLink></li>
                        <li className="nav-item"><NavLink activeClassName='active' to={TO_CUSTOMER_ORDERS} className="nav-link"><i className="fa fa-list"></i> My Orders</NavLink></li>
                        <li className="nav-item"><NavLink activeClassName='active' to={TO_CHANGE_PASSWORD} className="nav-link"><i className="fa fa-lock"></i> Change Password</NavLink></li>
                        <li className="nav-item"><NavLink activeClassName='active' to={TO_RETURN} className="nav-link"><i className="fa fa-undo"></i> Return Items</NavLink></li>
                        {/* <li className="nav-item"><Link activeClassName='active' to={TO_LOGOUT} className="nav-link"><i className="fa fa-power-off"></i> Logout</Link></li> */}
                        <li className="nav-item"><LogoutButton history={this.props.history} className="nav-link" text="Logout" /></li>
                    </ul>
                </div>
            </div>
        )
    }
}
