import React, { Component } from 'react';
import { connect } from 'react-redux';
import CustomerSectionTabs from '../../components/customer-section-tabs'
import { TO_LOGIN } from '../../helpers/routesConstants';
import Input from 'react-validation/build/input';
import Form from 'react-validation/build/form';
import Select from 'react-validation/build/select';
import store from '../../store';
import { customerUpdate } from '../../actions/customerAction';
import { isUpdated } from '../../actions/globalActions';
import { IN_PROCESS } from '../../helpers/actionConstants';
import { required,max25, max20,max2,maxZipLength, max16,phoneFormat, email, STATE_LIST } from '../../helpers/form-validation';
import Scroll from 'react-scroll';
var _ = require('lodash');


const { getData,overwrite } = require('country-list');
class CustomerAccountContainer extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
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
            // BillingAddress1: false,
            // BillingAddress2: false,
            // City: false, 
            // Country: false, 
            // CompanyName: false, 
            // State: false, 
            // PostalCode: false, 
            // stateList: STATE_LIST,
            countryList: getData(),
        }
    }
    handleChange(event) {
        if(event.target.name === 'PhoneNumber' )
        {
            if( event.target.value.length <= 25){
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
                this.setState({ customer });
            }
            else{
				event.preventDefault();
            }
        }
        else{
            console.log("else no phone no case")
            let customer = { ...this.state.customer };
            customer[event.target.name] = event.target.value;
            this.setState({ customer });
        }
       
    }
    handleUpdateSubmit = (event) => {
        event.preventDefault();

        this.form.validateAll()
        if (this.form.getChildContext()._errors.length === 0) {
            // console.log('state customer update',this.state.customer);
            // console.log('propo customer update',this.props.customer);
            if (JSON.stringify(this.props.customer) !== JSON.stringify(this.state.customer)) {
                store.dispatch({ type: IN_PROCESS, payload: true });
                let customer = JSON.stringify(this.state.customer)
                customer = JSON.parse(customer)
                delete customer.EmailAddress
                store.dispatch(customerUpdate(customer))
            } else {
                var thisObj = this;
                this.setState({ isUpdateAble: true })
                setTimeout(function () {
                    thisObj.setState({ isUpdateAble: false })
                }, 3000)
            }
        } else {
            // console.log('have errors', this.form.getChildContext()._errors);
        }
    };
    componentDidMount() {
        Scroll.animateScroll.scrollToTop();
        let sortedCountryList = _.sortBy(this.state.countryList, ['name'])
        this.setState({ countryList: sortedCountryList });
        if (this.props.isLoggedIn) {
            let customer = this.props.customer;
            if (customer){
                if(customer.CompanyName){
                    this.setState({ customer });
                }
                else{
                    customer['CompanyName'] = "SELF"
                    this.setState({ customer });
                }
            }
               
        }
    }
    componentWillReceiveProps(props) {

    }
    componentDidUpdate(prevProps) {
        if (prevProps.isLoggedIn !== this.props.isLoggedIn && !this.props.isLoggedIn) {
            this.props.history.push(TO_LOGIN)
        }
        if (this.props.customer && this.props.customer.CustomerID && this.state.customer.CustomerID === 0) {
            let customer = this.props.customer;
            if (customer){
                if(customer.CompanyName){
                    this.setState({ customer });
                }
                else{
                    customer['CompanyName'] = "SELF"
                    this.setState({ customer });
                }
            }
        }
        if (JSON.stringify(prevProps.customer) !== JSON.stringify(this.props.customer)) {
            let customer = this.props.customer;
            if (customer){
                if(customer.CompanyName){
                    this.setState({ customer });
                }
                else{
                    customer['CompanyName'] = "SELF"
                    this.setState({ customer });
                }
            }
        }
        if (prevProps.isUpdated !== this.props.isUpdated) {
            let customer = this.props.customer;
            if (customer){
                if(customer.CompanyName){
                    this.setState({ customer });
                }
                else{
                    customer['CompanyName'] = "SELF"
                    this.setState({ customer });
                }
            }
            setTimeout(function () {
                store.dispatch(isUpdated(false))
            }, 3000)
        }
    }
    zipFormat(event) {
        var entry = event.key
        var format = /^\w+([\s-_]\w+)*$/;
		if(!(entry.match(format)) && event.key != '-' && event.key != ' '){
			event.preventDefault(); 	
		}
    }
    PhoneFormat(event) {
        var x = event.key;
        // console.log(x)
		if(!(x >= 0 && x <= 9)){
			if(x != '+' && x != '-' && x != '('  && x != ')'  && x != '.'  && x != 'x'  && x != 'X' && x!=' '){
				event.preventDefault();  
			}
		}
	}
    render() {
        overwrite([{
            code: 'AX',
            name: 'Aland Islands'
          },{
          code: 'CW',
          name: 'Curacao'
        },{
            code: 'CI',
            name: 'Ivory Coast'
        },{
            code: 'LA',
            name: 'Laos'
        },{
            code: 'RE',
            name: 'Reunion'  
        },{
            code: 'BL',
            name: 'Saint Barthelemy'
        },{
            code: 'MF',
            name: 'Saint Martin (French)'
        },{
            code: 'SX',
            name: 'Sint Maarten (Dutch)'
        }
        ])
        // console.log(this.state.countryList)
        let countries = this.state.countryList.filter(country => {
            return country.code != 'CU' && country.code != 'IR' && country.code != 'KP' && country.code != 'US' 
        })
        let filteredCountried = this.state.countryList.filter(country => {
            return country.code == 'US'  
        })
        countries.unshift(filteredCountried[0]);
        // console.log(countries)
        return (
            <div id="content">
                <div className="container">
                    <div className="row bar">
                        <div id="customer-account" className="col-lg-9 clearfix">
                            {/* <p className="lead">Change your personal details.</p> */}
                            {/* <p className="text-muted">These details will be use as your Billing Details.</p> */}
                            <div className="bo3">
                                <div className="heading">
                                    <h3 className="text-uppercase">Account Address</h3>
                                </div>
                                <Form ref={c => { this.form = c }} onSubmit={this.handleUpdateSubmit.bind(this)}>
                                    <div className="row">
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label htmlFor="firstname">First Name</label>
                                                <Input validations={[required, max20]} name="FirstName" onChange={this.handleChange} value={this.state.customer.FirstName} id="firstname" type="text" className="form-control"></Input>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label htmlFor="lastname">Last Name</label>
                                                <Input validations={[required, max20]} name="LastName" onChange={this.handleChange} value={this.state.customer.LastName} id="lastname" type="text" className="form-control"></Input>
                                            </div>
                                        </div>
                                    
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="company">Company</label>
                                                <Input name="CompanyName" onChange={this.handleChange} value={this.state.customer.CompanyName} id="company" type="text" className="form-control"></Input>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="company">Address 1</label>
                                                <Input name="BillingAddress1" onChange={this.handleChange} value={this.state.customer.BillingAddress1} id="address1" type="text" className="form-control"></Input>
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
                                                <label htmlFor="email_account">Email</label>
                                                <Input validations={[required, email]} name="EmailAddress" onChange={this.handleChange} value={this.state.customer.EmailAddress} id="email_account" type="text" className="form-control" disabled></Input>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="company">Phone Number</label>
                                                <Input name="PhoneNumber" validations={[max25]} onKeyPress={this.PhoneFormat} onChange={this.handleChange} value={this.state.customer.PhoneNumber} id="phoneNumber" type="text" className="form-control"></Input>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 col-lg-3">
                                            <div className="form-group">
                                                <label htmlFor="country">Country</label>
                                                <Select name="Country" onChange={this.handleChange} value={this.state.customer.Country} id="country" className="form-control">
                                                    <option value="">-- Select Country --</option>
                                                    {
                                                        countries.map(function (country) {
                                                            return <option key={country.code}
                                                                value={country.code}>{country.name}</option>;
                                                        })
                                                    }
                                                </Select>
                                            </div>
                                        </div>
                                        {/* {this.state.customer.Country === "US" && (
                                                <div className="col-md-6 col-lg-3">
                                                <div className="form-group">
                                                    <label htmlFor="state">State</label>
                                                    <Select validations={[required]} name="State" onChange={this.handleChange} value={this.state.customer.State} id="State" className="form-control">
                                                        <option value="" disabled>State</option>
                                                        {
                                                            
                                                            this.state.stateList
                                                            .map(function (state) {
                                                                return <option key={state.code}
                                                                    value={state.code}>{state.name}</option>;
                                                            })
                                                        }
                                                    </Select>
                                                
                                                </div>
                                            </div>
                                             )}  */}
                                             {/* {this.state.customer.Country !== "US" && ( */}
                                            <div className="col-md-6 col-lg-3">
                                                <div className="form-group">
                                                    <label htmlFor="state">State</label>
                                                    <Input name="State" onChange={this.handleChange} value={this.state.customer.State} id="state" type="text" className="form-control"></Input>
                                                </div>
                                            </div>
                                              {/* )} */}
                                        <div className="col-md-6 col-lg-3">
                                            <div className="form-group">
                                                <label htmlFor="city">City</label>
                                                <Input name="City" onChange={this.handleChange} value={this.state.customer.City} id="city" type="text" className="form-control"></Input>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-3">
                                            <div className="form-group">
                                                <label htmlFor="zip">ZIP</label>
                                                <Input name="PostalCode" validations={[maxZipLength]} onKeyPress={this.zipFormat} onChange={this.handleChange} value={this.state.customer.PostalCode} id="zip" type="text" className="form-control"></Input>
                                            </div>
                                        </div>
                                        <div className="col-md-12 col-lg-12">
                                            {!this.props.inProcess && this.props.isUpdated && this.props.customerRes.status && this.props.customerRes.code === 200 && (
                                                <div className="alert alert-success">
                                                    <strong>Success!</strong> <span>{this.props.customerRes.msg}</span>
                                                </div>
                                            )}
                                            {!this.props.inProcess && this.props.isUpdated && this.props.customerRes.status && this.props.customerRes.code === 400 && (
                                                <div className="alert alert-danger">
                                                    <strong>Whoops!</strong> <span> {this.props.customerRes.msg}</span>
                                                </div>
                                            )}
                                            {!this.props.inProcess && this.props.isUpdated && this.props.customerRes.status === false && (
                                                <div className="alert alert-danger">
                                                    <strong>Whoops!</strong> <span> Something went wrong, try again.</span>
                                                </div>
                                            )}
                                            {!this.props.inProcess && this.state.isUpdateAble && (
                                                <div className="alert alert-info">
                                                    <strong>Info!</strong> <span> Nothing to change.</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-md-12 text-center">
                                            <button disabled={this.props.isUpdated} type="submit" className="btn btn-template-outlined"><i className="fa fa-save"></i> Save changes</button>
                                        </div>
                                    </div>
                                </Form>
                            </div>
                        </div>
                        <div className="col-lg-3 mt-4 mt-lg-0">
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
        isLoggedIn: state.global.isLoggedIn,
        inProcess: state.global.inProcess,
        isUpdated: state.global.isUpdated,
        customer: state.customer.customer.result,
        customerRes: state.customer.customer,
        products: state.product.products,
    };
};

export default connect(stateMap)(CustomerAccountContainer);

