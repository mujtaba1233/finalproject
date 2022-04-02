import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import { TO_LOGIN, TO_CUSTOMER_ACCOUNT, TO_TERM_AND_CONDITION, TO_PRIVACY_POLICY } from '../../helpers/routesConstants';
import store from '../../store';
import { customerRegister } from '../../actions/customerAction';
import { IN_PROCESS } from '../../helpers/actionConstants';
import { required, max20, min3, email, min8, password } from '../../helpers/form-validation';

class UserRegisterContainer extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            user: {
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                confirmPassword: ''
            },
            termsAndCondition:false,
            termsAndConditionValidation:true,
            firstName: false,
            lastName: false,
            email: false,
            password: false,
            confirmPassword: false,
            registrationValid: true, 
            invalidPassword: false,
        }
        this.baseState = this.state
    }
    handleChange(event) {
        if(event.target.name !== "termsAndCondition")
        {
            let user = { ...this.state.user };
            user[event.target.name] = event.target.value;
            this.setState({ user });
        }
        else{
            this.setState({ 
                termsAndCondition: event.target.checked,
                termsAndConditionValidation:event.target.checked
            });
        }
        
    }
    handleRegisterSubmit = (event) => {
        event.preventDefault();
        this.form.validateAll()
        // var passw = /^(?=.*\d)(?=.*[a-z]).{8,20}$/;
        // if(!this.state.user.password.match(passw)){
        //     this.setState({invalidPassword : true})
        // }
        if(!this.state.termsAndCondition){
            this.setState({
                termsAndConditionValidation:false
            })
        }
        if (this.form.getChildContext()._errors.length === 0 && this.state.invalidPassword == false &&  this.state.termsAndCondition) {
            store.dispatch({type: IN_PROCESS, payload: true});
            store.dispatch(customerRegister(this.state.user))
        }
    };
    componentWillMount() {
        if(this.props.isLoggedIn){
            this.props.history.push(TO_CUSTOMER_ACCOUNT)
        }
        this.setState({registrationValid:false})
    }
    componentDidUpdate(prevProps) {
        if (!this.state.registrationValid && this.props.registerRes.code >= 200 && this.props.registerRes.code < 400) {
            this.setState({registrationValid:true})
        }
        if(this.props.isLoggedIn){
            this.props.history.push(TO_CUSTOMER_ACCOUNT)
        }
    }
    render() {
        return (
            <div id="content">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="box">
                                <h2 className="text-uppercase">New account</h2>
                                <p className="lead">Not our registered customer yet?</p>
                                {/* <p className="text-muted">If you have any questions, please feel free to <a href="contact.html">contact us</a>, our customer service center is working for you 24/7.</p> */}
                                <hr></hr>
                                <Form ref={c => { this.form = c }} onSubmit={this.handleRegisterSubmit.bind(this)}>
                                    <div className="form-group">
                                        <label htmlFor="first-name-login">First Name</label>
                                        <Input validations={[required, max20, min3]} id="first-name-login" name="firstName" onChange={this.handleChange} value={this.state.user.firstName} type="text" className="form-control"></Input>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="last-name-login">Last Name</label>
                                        <Input validations={[required, max20, min3]} id="last-name-login" name="lastName" onChange={this.handleChange} value={this.state.user.lastName} type="text" className="form-control"></Input>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email-login">Email</label>
                                        <Input validations={[required, email]} id="email-login" name="email" onChange={this.handleChange} value={this.state.user.email} type="email" className="form-control"></Input>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="password-login">Password</label>
                                        <Input validations={[required, min8, password]} id="password-login" name="password" onChange={this.handleChange} value={this.state.user.password} type="password" className="form-control"></Input>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="confirm-password-login">Confirm Password</label>
                                        <Input id="confirm-password-login" onChange={this.handleChange} name="confirmPassword" value={this.state.user.confirmPassword} type="password" className="form-control"></Input>
                                    </div>
                                    <div className="form-group d-flex ml-3">
                                    <Input id="terms-and-condition" onChange={this.handleChange} name="termsAndCondition" value={this.state.termsAndCondition}  type="checkbox" className="d-flex form-check-input"></Input>
                                        <label className="form-check-label" htmlFor="terms-and-condition">By creating an account you are agreeing to the&nbsp;
                                        <Link target="_blank" className="" title="Terms And Conditions" to={TO_TERM_AND_CONDITION}> Terms of Service </Link> and
                                        <Link target="_blank" className="" title="Privacy Policy" to={TO_PRIVACY_POLICY}>  Privacy Policy </Link>
                                        
                                        </label>
                                    {
                                    !this.state.termsAndConditionValidation &&
                                    <span className="error text-danger">Accept Our Terms And Conditions First!</span>
                                    }
                                    </div>
                                    
                                    {!this.props.inProcess && this.state.registrationValid && (
                                        <div className="alert alert-success">
                                            <strong>Success!</strong> <span>{this.props.registerRes.msg} Login <Link to={TO_LOGIN}> Here</Link></span>
                                        </div>
                                    )}
                                    {/* {this.state.invalidPassword && (
                                        <div className="alert alert-danger">
                                        <strong>Whoops!</strong> <span> Password must have alphanumeric and numeric characters</span>
                                        </div>
                                    )} */}
                                    {!this.props.inProcess && this.props.registerRes.code >= 400 && (
                                        <div className="alert alert-danger">
                                            <strong>Whoops!</strong> <span> Something went wrong, try again.</span>
                                        </div>
                                    )}
                                    <div className="text-center">
                                        <button type="submit" disabled={this.state.registrationValid}  className="btn btn-template-outlined"><i className="fa fa-user"></i> Register</button>
                                    </div>
                                </Form>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="box">
                                <h2 className="text-uppercase">Login</h2>
                                <p className="lead">Already our customer?</p>
                                <hr></hr>
                                <div className='text-center'>
                                    <Link to={TO_LOGIN} className="btn btn-template-outlined"><i className="fa fa-sign-in"></i> Log in Here</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
const stateMapUserRegisterContainer = (state) => {
    return {
        isLoggedIn: state.global.isLoggedIn,
        registerRes: state.customer.regiterCustomer,
        inProcess: state.global.inProcess,
    };
};

export default connect(stateMapUserRegisterContainer)(UserRegisterContainer);
