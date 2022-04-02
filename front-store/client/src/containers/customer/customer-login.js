import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import { TO_REGISTER, TO_HOME, TO_RESET_PASSWORD } from '../../helpers/routesConstants';
import store from '../../store';
import { customerLoggedIn } from '../../actions/customerAction';
import { connect } from 'react-redux';
import { setCookie } from '../../helpers/cookie-helper';
import { CUSTOMER_COOKIE,CLIENT_KEY_RECAPTCHA } from '../../helpers/constants';
import { isLoggedIn } from '../../actions/globalActions';
import { IN_PROCESS } from '../../helpers/actionConstants';
import { required, email } from '../../helpers/form-validation';
import { getOrders } from '../../actions/orderAction';
import ReCAPTCHA from "react-google-recaptcha";



class UserLoginContainer extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            user: {
                email: '',
                password: '',
            },
            email: false,
            password: false,
            captchaVal: '',
            captchaConfirm: true
        }
    }
    handleChange(event) {
        let user = { ...this.state.user };
        user[event.target.name] = event.target.value;
        this.setState({ user });
    }
    recaptchaOnChange = (val) =>{
        this.setState({
            captchaVal: val
        })
    }
    handleLoginSubmit = (event) => {
        event.preventDefault();
        this.form.validateAll()
        if (this.form.getChildContext()._errors.length === 0) {
            if(this.state.captchaVal){
                store.dispatch({ type: IN_PROCESS, payload: true });
                store.dispatch(customerLoggedIn(this.state.user));
            }
            else{
                this.setState({
                    captchaConfirm:false
                })
            }
        } else {
            console.log('form vali error', this.form.getChildContext()._errors);
        }
    };
    componentWillMount() {
        if (this.props.isLoggedIn) {
            this.props.history.push(TO_HOME)
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props.loginUser && this.props.loginUser.code === 200) {
            var thisObj = this
            setTimeout(function () {
                store.dispatch(isLoggedIn(true))
                store.dispatch(getOrders(thisObj.props.loginUser.result));
                setCookie(CUSTOMER_COOKIE, thisObj.props.loginUser)
                thisObj.props.history.push(TO_HOME)
            }, 500)
        }
        if (this.props.isLoggedIn) {
            this.props.history.push(TO_HOME)
        }
    }
    render() {
        // console.log(this.props.loginUser)
        return (
            <div id="content">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="box">
                                <h2 className="text-uppercase">Login</h2>
                                <p className="lead">Already our customer?</p>
                                {/* <p className="text-muted">Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.</p> */}
                                <hr></hr>
                                <Form ref={c => { this.form = c }} onSubmit={this.handleLoginSubmit.bind(this)}>
                                    <div className="form-group">
                                        <label htmlFor="email">Email</label>
                                        <Input validations={[required, email]} id="email" name='email' onChange={this.handleChange} value={this.state.user.email} type="text" className="form-control"></Input>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="password">Password</label>
                                        <Input validations={[required]} id="password" name="password" type="password" onChange={this.handleChange} value={this.state.user.password} className="form-control"></Input>
                                    </div>
                                    <div className="form-group">
                                        <ReCAPTCHA
                                            sitekey={CLIENT_KEY_RECAPTCHA}
                                            onChange={this.recaptchaOnChange}
                                        />
                                    </div>
                                    {!this.props.inProcess && this.props.loginUser.status && this.props.loginUser.code === 200 && (
                                        <div className="alert alert-success">
                                            <strong>Success!</strong> <span>{this.props.loginUser.msg}</span>
                                        </div>
                                    )}
                                    {!this.props.inProcess && this.props.loginUser.status && this.props.loginUser.code === 400 && (
                                        <div className="alert alert-danger">
                                            <strong>Whoops!</strong> <span> {this.props.loginUser.msg}</span>
                                        </div>
                                    )}
                                    {!this.props.inProcess && this.props.loginUser.status === false && (
                                        <div className="alert alert-danger">
                                            <strong>Whoops!</strong> <span> Something went wrong, try again.</span>
                                        </div>
                                    )}
                                    {(!this.state.captchaConfirm && !this.state.captchaVal) && (
                                        <div className="alert alert-danger">
                                            <strong>Whoops!</strong> <span>Please confirm you are not robot.</span>
                                        </div>
                                    )}
                                    <div className="text-center">
                                        <button type="submit" disabled={this.state.loginSuccess} className="btn btn-template-outlined"><i className="fa fa-sign-in"></i> Log in</button>
                                    </div>
                                    <div className="hey">
                                        <Link className="text-decoration-none" to={TO_RESET_PASSWORD}>Forgot password?</Link>
                                    </div>
                                </Form>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="box">
                                <h2 className="text-uppercase">Register</h2>
                                <p className="lead">Not our registered customer yet?</p>
                                {/* <p>With registration with us new world of fashion, fantastic discounts and much more opens to you! The whole process will not take you more than a minute!</p>
                                    <p className="text-muted">If you have any questions, please feel free to <a href="contact.html">contact us</a>, our customer service center is working for you 24/7.</p> */}
                                <hr></hr>
                                <div className='text-center'>
                                    <Link to={TO_REGISTER} className="btn btn-template-outlined"><i className="fa fa-user"></i> Register Here</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
const stateMapUserLoginContainer = (state) => {
    return {
        inProcess: state.global.inProcess,
        loginUser: state.customer.customer,
        isLoggedIn: state.global.isLoggedIn,
    };
};

export default connect(stateMapUserLoginContainer)(UserLoginContainer);
