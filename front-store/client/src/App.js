import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Routes from "./routes/Routes";
import Header from './components/header';
import { Footer } from './components/footer';
import { fetchProducts } from './actions/productAction'
import { fetchCategories } from './actions/categoryAction'
import { connect } from 'react-redux';
import store from './store';
import { syncQuantity } from './actions/catalogActions';
import { addToCart } from './actions/cartActions';
import { getCookie } from "./helpers/cookie-helper";
import { CUSTOMER_COOKIE, DEV_MODE, ENVIR0NMENT } from "./helpers/constants";
import { setCustomerFromCookie, saveRecord } from "./actions/customerAction";
import { isLoggedIn, checkAccess } from "./actions/globalActions";
import { getOrders } from "./actions/orderAction";
import { parseFreeAccessories } from "./helpers/utility";
import axios from 'axios';
import { CookieView } from "./components/cookieView";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cartItems: JSON.parse(localStorage.getItem('cartStatePersist')) || []
        }

    }
    componentWillMount() {
        store.dispatch(fetchProducts())
        store.dispatch(fetchCategories());
    }
    componentDidMount = () => {
        let getCookieValue = getCookie("acceptCookie");
        if(getCookieValue){
            const script = document.createElement("script");
            if (DEV_MODE && ENVIR0NMENT.toLowerCase() === 'development')
                script.src = "https://jstest.authorize.net/v1/Accept.js";
            else
                script.src = "https://js.authorize.net/v1/Accept.js";
            script.type = "text/javascript";
            script.charset = "utf-8";
            document.body.appendChild(script);
            
            store.dispatch(checkAccess())
            var thisObj = this;
            var intervalId = setInterval(function () {
                if (store.getState().product.products.length > 0) {
                    clearInterval(intervalId);
                    thisObj.state.cartItems.forEach(function (item) {
                        var index = store.getState().product.products.findIndex(i => i.ProductCode === item.ProductCode)
                        if (index > -1) {
                            var syncCatalog = {
                                ProductCode: item.ProductCode,
                                Quantity: item.Quantity
                            }
                            let product = store.getState().product.products[index];
                            product.Quantity = item.Quantity
                            product.SelectedOptions = item.SelectedOptions
                            product.Childs = parseFreeAccessories(product, store.getState().product.products)
                            store.dispatch(addToCart(product));
                            store.dispatch(syncQuantity(syncCatalog));
                            thisObj.setState({ test: 123 })
                        }
                    })
                }
            }, 10);
            let customer = getCookie(CUSTOMER_COOKIE, true)
            // console.log(customer)
            if (customer !== undefined && customer.code && parseInt(customer.code) === 200) {
                store.dispatch(setCustomerFromCookie(customer))
                store.dispatch(getOrders(customer.result));
                store.dispatch(isLoggedIn(true))
            } else {
                store.dispatch(isLoggedIn(false))
            }
        }
    }

    componentDidUpdate = (prevProps) => {
        // if (this.props.ip !== prevProps.ip) {
            let customer = getCookie(CUSTOMER_COOKIE, true)
            let currentUrl = window.location.href.replace(/^.*\/\/[^\/]+/, '')
            if (customer) {
                let userData = { firstname: customer.result.FirstName, lastname: customer.result.LastName, email: customer.result.EmailAddress, userId: customer.result.CustomerID, ipAddress: store.getState().customer.ip, lastModifyOn: new Date, url: currentUrl, type: 'Store' }
                store.dispatch(saveRecord(userData))
            } else {
                let userData = { firstname: 'anonymous', lastname: 'anonymous', email: null, userId: null, ipAddress: store.getState().customer.ip, lastModifyOn: new Date, url: currentUrl, type: 'Store' }
                store.dispatch(saveRecord(userData))
            }
        // }
    }

    componentWillReceiveProps(props) {
        // console.log("nnnwe props", props)
        this.props = props
    }
    render() {
        return (
            <div id="all">
                <Header history={this.props.history} />
                <Routes />
                <CookieView/>
                <Footer />
            </div>
        );
    }
}
const stateMapApp = (state) => {
    return {
        products: state.product.products,
        ip: state.customer.ip
    };
};
connect(stateMapApp)(App);


export default withRouter(App);
