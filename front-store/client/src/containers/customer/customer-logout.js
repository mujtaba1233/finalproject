import React, { Component } from 'react';
import { TO_HOME } from '../../helpers/routesConstants';
import store from '../../store';
import { isLoggedIn } from '../../actions/globalActions';
import { removeCookie } from '../../helpers/cookie-helper';
import { CUSTOMER_COOKIE } from '../../helpers/constants';
import { setCustomerFromCookie } from '../../actions/customerAction';
import Scroll from 'react-scroll';

export default class CustomerLogoutContainer extends Component {
    componentDidMount(){
        Scroll.animateScroll.scrollToTop();
        store.dispatch(isLoggedIn(false));
        store.dispatch(setCustomerFromCookie({}))
        removeCookie(CUSTOMER_COOKIE)
        var thisObj = this;
        setTimeout(function(){
            thisObj.props.history.push(TO_HOME);
        },800)
    }
    componentDidUpdate(prevProps) {

    }
    render() {
        return (
            <div id="content">
                <div className="container">
                    <div className="row bar">
                        <div id="customer-account" className="col-lg-12 clearfix">
                            <p className="lead">Logging You out...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

