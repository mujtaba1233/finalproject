import React from "react";
import { LoginAction, googleAction } from "../../actions/user/login";
import store from "../../store"
import "./login-form.scss";
import { connect } from 'react-redux';
import { CLIENT_KEY_GOOGLE_LOGIN, CLIENT_KEY_RECAPTCHA, IN_PROCESS, IS_LOGIN, PATH_COOKIE, TOKEN_COOKIE, TO_EXTERNAL_LOGIN, TO_LOGIN, TO_QUOTE_LIST, TO_RECOVER_PASSWORD, USER_COOKIE } from "../../helpers/constants";
import { toast, setToken, setUser } from "../../helpers/utility";
import { email, required } from '../../helpers/form-validation'
import { Button, Row, Col } from "react-bootstrap";
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import { Link } from "react-router-dom";
import cookie from 'react-cookies'
import ReCAPTCHA from "react-google-recaptcha";
import { GoogleLogin } from 'react-google-login';
import { WidthType } from "docx";

var qs = require('qs');

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleOnSubmit = this.handleOnSubmit.bind(this);
        this.state = {
            user: {
                email: '',
                password: ''
            },
            user_detail: {
                profileObj: '',
            },
            redirect: '',
            captchaVal: '',
            captchaConfirm: true
        }
    }
    handleChange(e) {
        let user = this.state.user
        user[e.target.name] = e.target.value;
        this.setState({ user })
    }
    handleOnSubmit(e) {
        e.preventDefault();
        console.log(this.form);
        this.form.validateAll()
        if (this.form.getChildContext()._errors.length === 0) {
            if (this.state.captchaVal) {
                store.dispatch({ type: IN_PROCESS, payload: true });
                store.dispatch(LoginAction(this.state.user)) //set in session storage
            }
            else {
                this.setState({
                    captchaConfirm: false
                })
            }
        }
    };
    onSuccess = (res) => {
        let user_detail = this.state.user_detail
        user_detail.profileObj = res.profileObj
        user_detail.profileObj.accessToken = res.tokenObj.access_token
        this.setState({ user_detail })
        store.dispatch(googleAction(this.state.user_detail.profileObj))
    }
    onFailure = (res) => {
        console.log('[LOGIN failure currentUser]:', res)
        toast("Only users registered with intrepidcs can login", "success")
    }

    componentDidMount() {
        let queryString = qs.parse(this.props.history.location.search, { ignoreQueryPrefix: true })
        if (Object.keys(queryString).length)
            this.setState({ redirect: queryString.redirect })
        if (this.props.user.isLoggedIn) {
            if (queryString.redirect) {
                this.props.history.push(queryString.redirect)
            } else {
                this.props.history.push(TO_QUOTE_LIST)
            }
        }
        else {
            cookie.remove(TOKEN_COOKIE, { path: PATH_COOKIE })
            cookie.remove(USER_COOKIE, { path: PATH_COOKIE })
            store.dispatch({ type: IS_LOGIN, payload: false })
        }
    }
    recaptchaOnChange = (val) => {
        this.setState({
            captchaVal: val
        })
    }
    componentDidUpdate(prevProps) {
        if (JSON.stringify(this.props.user) !== JSON.stringify(prevProps.user)) {
            if (this.props.user.isLoggedIn !== prevProps.user.isLoggedIn && this.props.user.isLoggedIn) {
                if (this.props.user.user.token) {
                    setToken(this.props.user.user.token)
                    setUser(this.props.user.user)
                }
                // window.location.reload();
                if (this.state.redirect)
                    this.props.history.push(this.state.redirect)
                else
                    this.props.history.push(TO_QUOTE_LIST)
            } else if (this.props.user.isLoggedIn === false && this.props.user.loginMessage) {
                cookie.remove(TOKEN_COOKIE, { path: PATH_COOKIE })
                cookie.remove(USER_COOKIE, { path: PATH_COOKIE })
                store.dispatch({ type: IS_LOGIN, payload: false })
                toast(this.props.user.loginMessage, 'error')
            }


        }
    }
    render() {
        return (
            <div className="justify-content-sm-center">
                {window.location.pathname === TO_EXTERNAL_LOGIN  && 
                 <div className="justify-content-lg-center ">
                 <div className="container">
                     <div style={{height:'100vh'}} className="row align-items-center">
                        <div className="col-sm-8 col-md-5 mx-auto">
                            <div class="card text-center shadow-lg bg-white rounded"  >
                        <div class="card-body">
                            <img
                                className="mb-4 mt-1 img-fluid"   
                                src={require("../../assets/images/logo.png")}
                                alt="logo"
                            />
                            <p className="text-center text-muted">
                                    Login to Bluesky
                            </p>
                            <Form ref={c => { this.form = c }} onSubmit={(data) => this.handleOnSubmit(data)}>
                                    <Row>
                                        <Col className=" p-0 mb-3">
                                            <Input validations={[email]} className='input form-control' type='text' value={this.state.email} name="email" onChange={this.handleChange} placeholder='Email' />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className=" p-0 mb-3">
                                            <Input validations={[required]} className='input form-control' type='password' value={this.state.password} name="password" onChange={this.handleChange} placeholder='Password' />
                                        </Col>
                                    </Row>
                                    <Row >
                                        <ReCAPTCHA
                                            className="mx-auto"
                                            sitekey={CLIENT_KEY_RECAPTCHA}
                                            onChange={this.recaptchaOnChange}
                                        />
                                    </Row>
                                    <Row className="mt-4 mb-2">
                                        <Button variant="primary" type="submit" size="" block>
                                            Login
                                        </Button>
                                    </Row>

                                    {(!this.state.captchaConfirm && !this.state.captchaVal) && (
                                        <div className="alert alert-danger">
                                            <strong>Whoops!</strong> <span>Please confirm you are not robot.</span>
                                        </div>
                                    )}
                                    <Row>
                                        <p className="text-center ml-0 w-100 img-fluid">
                                            forgot password? <Link to={TO_RECOVER_PASSWORD}>Reset</Link><br />
                                            <span> OR </span><br />
                                            <a href={TO_LOGIN}>Login IntrepidCS User </a>
                                        </p>
                                    </Row>

                                </Form>
                                </div>
                        </div>
                            </div>
                        </div>
                    </div>
                </div>}

                {window.location.pathname === TO_LOGIN  && 
                 <div className="justify-content-lg-center ">
                 <div className="container">
                    <div style={{height:'100vh'}} className="row align-items-center">
                        <div className="col-sm-8 col-md-6 mx-auto">
                            <div class="card text-center shadow-lg p-3 bg-white rounded"  >
                        <div class="card-body">
                            <img
                                className="mb-4 mt-3 img-fluid"   
                                src={require("../../assets/images/600pixel.png")}
                                alt="logo"
                            />
                            <p className="text-center text-muted ">
                                Login to Bluesky
                            </p>
                                <GoogleLogin
                                    clientId={CLIENT_KEY_GOOGLE_LOGIN}
                                    buttonText="Sign in with Google"
                                    className="mt-4 mb-2 mx-auto"       
                                    onSuccess={this.onSuccess}
                                    onFailure={this.onFailure}
                                    hostedDomain="intrepidcs.com"
                                    />
                                    <br/>
                                    <span> OR </span>
                                    <p className="text-center ml-0 w-100">
                                    <br/>
                                        <a href={TO_EXTERNAL_LOGIN}>Login as External User </a>
                                    </p> </div>
                        </div>
                            </div>
                        </div>
                    </div>
                </div>}
            </div>

        )
    }
}
const stateMap = (state) => {
    return {
        user: state.user,
        global: state.global,
    };
};
export default connect(stateMap)(LoginForm);
