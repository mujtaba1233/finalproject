import React, { Component } from 'react';
import { connect } from 'react-redux';
import OrderSummary from '../../components/order-summary';
import { Link } from 'react-router-dom'
import { TO_CART, TO_CHECKOUT_SHIPPING, TO_CHECKOUT_USER_DETAIL, TO_CHECKOUT_BILLING_ADDRESS, TO_CUSTOMER_ACCOUNT } from '../../helpers/routesConstants';
import Input from 'react-validation/build/input';
import Form from 'react-validation/build/form';
import Select from 'react-validation/build/select';
import NavLink from 'react-router-dom/NavLink';
import { PREPARE_ORDER } from '../../helpers/actionConstants';
import store from '../../store';
import { required,max25, max20, min3, min2, max2, max16, phoneFormat, email, STATE_LIST } from '../../helpers/form-validation';
import Scroll from 'react-scroll';
import { cartTotal, totalShipping, totalTax } from '../../actions/globalActions';
import { checkCartForFreeShipping } from '../../helpers/utility';


var _ = require('lodash');
require('dotenv').config()
const { getData, overwrite } = require('country-list');

class CheckoutUserDetailContainer extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeOfSameAsBilling = this.handleChangeOfSameAsBilling.bind(this);
        this.zipFormat = this.zipFormat.bind(this);
        this.PhoneFormat = this.PhoneFormat.bind(this);
        this.state = {
            customer: {
                CustomerID: 0,
                FirstName: '',
                LastName: '',
                EmailAddress: '',
                BillingAddress1: '',
                BillingAddress2: '',
                City: '',
                Country: '',
                CompanyName: 'SELF',
                State: '',
                PostalCode: '',
                PhoneNumber: '',
            },
            FirstName: false,
            LastName: false,
            EmailAddress: false,
            isUpdateAble: false,
            BillingAddress1: false,
            // BillingAddress2: false,
            City: false,
            Country: false,
            CompanyName: false,
            State: false,
            PostalCode: false,
            sameAsBilling: false,
            PhoneNumber: false,
            stateList: STATE_LIST,
            countryList: getData(),
            freeShipping:checkCartForFreeShipping()
        }
        this.baseState = this.state
    }
    // onErrorHandler = (response) => {
    //     this.setState({
    //         status: ["failure", response.messages.message.map(err => err.text)]
    //     });
    // };

    // onSuccessHandler = (response) => {
    //     // Process API response on your backend...
    //     this.setState({ status: ["failure", []] });
    // };
    handleChangeOfSameAsBilling(event) {
        var thisObj = this
        this.setState({ sameAsBilling: !this.state.sameAsBilling }, () => {
            if (thisObj.state.sameAsBilling) {
                thisObj.setState({ customer: thisObj.props.customer });
            } else {
                thisObj.setState(thisObj.baseState)
            }
        });
    }
    handleChange(event) {
        if(event.target.name === "PhoneNumber")
        {
            var x = event.target.value
            event.target.value = ''
            x = x.split('');
            x.forEach(number => {
                var z = number.charCodeAt()
                if (!(z >= 48 && z <= 57)) {
                    if (z != 43 && z != 120 && z != 88 && z != 32 && z != 46 && z != 45 && z != 43 && z != 40 && z != 41) {
                        // event.preventDefault();
                        
                    }
                    else{
                        event.target.value=	event.target.value + number
                    }
                }
                else{
                    event.target.value=	event.target.value + number
                }

            });                                                 
        }
        let customer = { ...this.state.customer };
        customer[event.target.name] = event.target.value;
        // console.log(this.state.customer)
        this.setState({ customer });
    }
    handleUpdateSubmit = (event) => {
        event.preventDefault();

        this.form.validateAll();
        if (this.form.getChildContext()._errors.length === 0) {
            // console.log('api call customer update',this.state.customer);
            // console.log('partial order save process will be handle here', this.state.customer);
            var orderObj = {
                BillingAddress1: this.state.customer.BillingAddress1,
                BillingAddress2: this.state.customer.BillingAddress2,
                BillingCity: this.state.customer.City,
                BillingCompanyName: this.state.customer.CompanyName,
                BillingCountry: this.state.customer.Country,
                BillingFirstName: this.state.customer.FirstName,
                BillingLastName: this.state.customer.LastName,
                BillingPostalCode: this.state.customer.PostalCode,
                BillingState: this.state.customer.State,
                BillingPhoneNumber: this.state.customer.PhoneNumber,

                // ShipAddress1: this.state.customer.BillingAddress1,
                // ShipAddress2: this.state.customer.BillingAddress2,
                // ShipCity: this.state.customer.City,
                // ShipCompanyName: this.state.customer.CompanyName,
                // ShipCountry: this.state.customer.Country,
                // ShipFirstName: this.state.customer.FirstName,
                // ShipLastName: this.state.customer.LastName,
                // ShipPostalCode: this.state.customer.PostalCode,
                // ShipState: this.state.customer.State,
                // ShipPhoneNumber: this.state.customer.PhoneNumber,

                CustomerID: this.props.customer.CustomerID,
                EmailAddress: this.state.customer.EmailAddress,

                OrderDetails: this.props.cartItems,
            }
            store.dispatch({ type: PREPARE_ORDER, payload: orderObj });
            this.props.history.push(TO_CHECKOUT_USER_DETAIL);

            // store.dispatch(orderToPlace(this.state.customer))
        } else {
            console.log('have errors', this.form.getChildContext()._errors);
        }
    };
    componentDidMount() {
        Scroll.animateScroll.scrollToTop();
        // console.log(this.props.orderToBePlace);
        store.dispatch(cartTotal(0));
        store.dispatch(totalTax(0));
        store.dispatch(totalShipping(0));
        let customer = this.props.customer;
        let tempCustomer = {
            BillingAddress1: this.props.orderToBePlace.BillingAddress1 || '',
            BillingAddress2: this.props.orderToBePlace.BillingAddress2 || '',
            City: this.props.orderToBePlace.BillingCity || '',
            CompanyName: this.props.orderToBePlace.BillingCompanyName || 'SELF',
            Country: this.props.orderToBePlace.BillingCountry || '',
            FirstName: this.props.orderToBePlace.BillingFirstName || '',
            LastName: this.props.orderToBePlace.BillingLastName || '',
            PostalCode: this.props.orderToBePlace.BillingPostalCode || '',
            State: this.props.orderToBePlace.BillingState || '',
            PhoneNumber: this.props.orderToBePlace.BillingPhoneNumber || '',

            EmailAddress: this.props.orderToBePlace.EmailAddress || '',
            CustomerID: this.props.orderToBePlace.CustomerID || '',
        };
        let sortedCountryList = _.sortBy(this.state.countryList, ['name'])
        this.setState({ countryList: sortedCountryList });
        if (customer) {
            this.setState({ customer: tempCustomer });
            window.onbeforeunload = function (event) {
                return "are you sure?";
            };
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.customer && this.props.customer.CustomerID && this.state.customer.CustomerID === 0) {
            // let customer = this.props.customer;
            // this.setState({ customer });
            window.onbeforeunload = function () {
                return "are you sure";
            };
        }
    }
    zipFormat(event) {
        var entry = event.key
        var format = /^\w+([\s-_]\w+)*$/;
        if (!(entry.match(format)) && event.key != '-' && event.key != ' ') {
            event.preventDefault();
        }
    }
    PhoneFormat(event) {
        var x = event.key;
        // console.log(x)
        if (!(x >= 0 && x <= 9)) {
            if (x != '+' && x != '-' && x != '('  && x != ')'  && x != '.'  && x != 'x'  && x != 'X' && x!=' ') {
                event.preventDefault();
            }
        }
    }
    render() {
        overwrite([{
            code: 'AX',
            name: 'Aland Islands'
        }, {
            code: 'CW',
            name: 'Curacao'
        }, {
            code: 'CI',
            name: 'Ivory Coast'
        }, {
            code: 'LA',
            name: 'Laos'
        }, {
            code: 'RE',
            name: 'Reunion'
        }, {
            code: 'BL',
            name: 'Saint Barthelemy'
        }, {
            code: 'MF',
            name: 'Saint Martin (French)'
        }, {
            code: 'SX',
            name: 'Sint Maarten (Dutch)'
        }
        ])
        let countries = this.state.countryList.filter(country => {
            return country.code != 'CU' && country.code != 'IR' && country.code != 'KP' && country.code != 'US' && country.code !=  'SY'
        })
        let filteredCountried = this.state.countryList.filter(country => {
            return country.code == 'US'
        })
        countries.unshift(filteredCountried[0]);
        return (
            <div id="content">
                <div className="container">
                    <div className="row">
                        <div id="checkout" className="col-lg-9">
                            <div className="box border-bottom-0">
                                <ul className="nav nav-pills nav-fill">
                                    <li className="nav-item"><NavLink to={TO_CHECKOUT_BILLING_ADDRESS} activeClassName='active' className="nav-link"> <i className="fa fa-address-card"></i><br></br>Billing Address</NavLink></li>
                                    <li className="nav-item"><a href="javascript:void(0)" className="nav-link disabled"><i className="fa fa-map-marker"></i><br></br>Shipping Address</a></li>
                                   {!this.state.freeShipping && <li className="nav-item"><a href="javascript:void(0)" className="nav-link disabled"><i className="fa fa-truck"></i><br></br>Delivery Method</a></li>}
                                    <li className="nav-item"><a href="javascript:void(0)" className="nav-link disabled"><i className="fa fa-eye"></i><br></br>Order Review</a></li>
                                    <li className="nav-item"><a href="javascript:void(0)" className="nav-link disabled"><i className="fa fa-money"></i><br></br>Payment Method</a></li>
                                </ul>
                                <div className="row">
                                    <div className="col-md-12 form-group">
                                        <input onChange={this.handleChangeOfSameAsBilling} value={this.state.sameAsBilling} name="sameAsBilling" id="sameAs" type="checkbox"></input> <label htmlFor="sameAs">Same as <strong>account</strong> address? <Link to={TO_CUSTOMER_ACCOUNT}> Change account address</Link></label>
                                    </div>
                                </div>
                                {/* <FormContainer
                                    environment="sandbox"
                                    onError={this.onErrorHandler}
                                    onSuccess={this.onSuccessHandler}
                                    amount={23}
                                    component={FormComponent}
                                    clientKey={'46gk36Be6QJ76ByU3NZjpdMZqJeUJyM962Wc3Q86kyg3d3sTCqT3uN2g7UtjWcZF'}
                                    apiLoginId={'3xS98PkAb2x'}
                                /> */}
                                <Form ref={c => { this.form = c }} onSubmit={this.handleUpdateSubmit.bind(this)}>
                                    <div className="content">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label htmlFor="firstname">First Name</label>
                                                    <Input validations={[required, max20]} name="FirstName" onChange={this.handleChange} value={this.state.customer.FirstName} id="firstname" type="text" className="form-control"></Input>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label htmlFor="lastname">Last Name</label>
                                                    <Input validations={[required, max20]} name="LastName" onChange={this.handleChange} value={this.state.customer.LastName} id="lastname" type="text" className="form-control"></Input>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label htmlFor="company">Address 1</label>
                                                    <Input validations={[required]} name="BillingAddress1" onChange={this.handleChange} value={this.state.customer.BillingAddress1} id="address1" type="text" className="form-control"></Input>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label htmlFor="street">Address 2</label>
                                                    <Input name="BillingAddress2" onChange={this.handleChange} value={this.state.customer.BillingAddress2} id="address2" type="text" className="form-control"></Input>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label htmlFor="PhoneNumber">Phone Number</label>
                                                    <Input validations={[required, max25]} name="PhoneNumber" onKeyPress={this.PhoneFormat} onChange={this.handleChange} value={this.state.customer.PhoneNumber || ''} id="PhoneNumber" type="text" className="form-control"></Input>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label htmlFor="company">Company</label>
                                                    <Input name="CompanyName"  onChange={this.handleChange} value={this.state.customer.CompanyName} id="company" type="text" className="form-control"></Input>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 col-lg-3">
                                                <div className="form-group">
                                                    <label htmlFor="country">Country</label>
                                                    <Select validations={[required]} name="Country" onChange={this.handleChange} value={this.state.customer.Country} id="country" className="form-control">
                                                        <option value="" disabled>Country</option>
                                                        {

                                                            countries
                                                                .map(function (country) {
                                                                    return <option key={country.code}
                                                                        value={country.code}>{country.name}</option>;
                                                                })
                                                        }
                                                    </Select>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-lg-3">
                                                <div className="form-group">
                                                    <label htmlFor="state">State</label>
                                                    <Input name="State" onChange={this.handleChange} value={this.state.customer.State} id="state" type="text" className="form-control"></Input>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-lg-3">
                                                <div className="form-group">
                                                    <label htmlFor="city">City</label>
                                                    <Input validations={[required]} name="City" onChange={this.handleChange} value={this.state.customer.City} id="city" type="text" className="form-control"></Input>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-lg-3">
                                                <div className="form-group">
                                                    <label htmlFor="zip">ZIP</label>
                                                    <Input name="PostalCode" onChange={this.handleChange} onKeyPress={this.zipFormat} value={this.state.customer.PostalCode} id="zip" type="text" className="form-control"></Input>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row mgTp30">
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                            <Link to={TO_CART} className="btn btn-secondary mt-0"><i className="fa fa-chevron-left"></i> Back to Cart</Link>
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                            <button type="submit" className="btn btn-template-outlined pull-right"> Continue to shipping address <i className="fa fa-chevron-right"></i></button>
                                        </div>
                                    </div>
                                </Form>
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <OrderSummary showTaxAndShipping={false} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const stateMap = (state) => {
    return {
        global: state.global,
        products: state.product.products,
        orderToBePlace: state.order.orderToBePlace,
        customer: state.customer.customer.result,
        cartItems: state.cart,
        isLoggedIn: state.global.isLoggedIn,
        inProcess: state.global.inProcess,
        cartAccess: state.global.cartAccess,
    };
};

export default connect(stateMap)(CheckoutUserDetailContainer);
