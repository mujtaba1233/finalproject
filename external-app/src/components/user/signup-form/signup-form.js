import React from "react";
import { RegisterAction } from "../../../actions/user/register";
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import { Link } from "react-router-dom";
import { Button, Row, Col } from "react-bootstrap";
import { email, required, password } from '../../../helpers/form-validation'
import store from "../../../store"
import "./signup-form.scss";
import { connect } from 'react-redux';
import { TO_LOGIN } from "../../../helpers/constants";
import { toast } from "../../../helpers/utility";

class SignupForm extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleOnSubmit = this.handleOnSubmit.bind(this);
        this.state = {
            user: {
                email: '',
                firstName: '',
                lastName: '',
                password: '',
                confirmPassword: '',
            }
        }
    }
    handleChange(e) {
        let user = this.state.user
        user[e.target.name] = e.target.value;
        this.setState({ user })
    }
    handleOnSubmit(e) {
        e.preventDefault();
        this.form.validateAll()
        if (this.form.getChildContext()._errors.length === 0) {
            store.dispatch(RegisterAction(this.state.user)) //set in session storage
        } else {
            console.log('form vali error', this.form.getChildContext()._errors);
        }
    };
    componentDidUpdate(prevProps) {
        if (this.props.user.isRegistered !== prevProps.user.isRegistered && this.props.user.isRegistered) {
            toast(this.props.user.registerMessage)
            this.props.history.push(TO_LOGIN + this.props.history.location.search)
        } else if (this.props.user.isRegistered !== prevProps.user.isRegistered && this.props.user.isRegistered === false) {
            toast(this.props.user.registerMessage, 'error')
        }
    }
    render() {
        return (

            <div className="justify-content-sm-center sign-up-form">
                <div className="container mt-5">
                    <div className="col-sm-4 col-md-4 mx-auto">
                        <div className="container-fluid">
                            <img
                                className="mb-4 mt-5"
                                src={require("../../../assets/images/logo.png")}
                                alt="logo"
                            />
                            <h3 className="text-center">Sign up to get started</h3>
                            <p className="mb-4 text-center text-muted">
                                Create an account to begin networking with friends all over the
                                world
                            </p>
                            <Form ref={c => { this.form = c }} onSubmit={this.handleOnSubmit}>
                                <Row className='d-flex'>
                                    <Col className="p-0 mr-2 mb-3">
                                        <Input validations={[required]} className='input form-control' type='text' value={this.state.firstName} name="firstName" onChange={this.handleChange} placeholder='First Name' />
                                    </Col>
                                    <Col className="p-0 ml-2 mb-3">
                                        <Input validations={[required]} className='input form-control' type='text' value={this.state.lastName} name="lastName" onChange={this.handleChange} placeholder='Last Name' />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className=" p-0 mb-3">
                                        <Input validations={[email]} className='input form-control' type='text' value={this.state.email} name="email" onChange={this.handleChange} placeholder='Email' />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className=" p-0 mb-3">
                                        <Input validations={[password]} className='input form-control' type='password' value={this.state.password} name="password" onChange={this.handleChange} placeholder='Password' />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="p-0 mb-2">
                                        <Input validations={[required]} className='input form-control' type='password' value={this.state.confirmPassword} name="confirmPassword" onChange={this.handleChange} placeholder='Confirm Password' />
                                    </Col>
                                </Row>
                                <Row className="mb-2">
                                    <small className="text-muted text-center d-block">
                                        By signing up I agree to the <a href="#">Terms of use</a>{" "}
                                        and <a href="#">Privacy Policy</a>
                                    </small>
                                </Row>
                                <Row className="mt-4 mb-5">
                                    <Button variant="primary" type="submit" size="lg" block>
                                        Sign up
                                    </Button>
                                </Row>
                                <Row>
                                    <p className="text-center ml-0 w-100">
                                        Already have an account? <Link to={TO_LOGIN}>Sign In</Link>
                                    </p>
                                </Row>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
           
        );
    }
}
const stateMapCreateEvent = (state) => {
    return {
        user: state.user,
    };
};
export default connect(stateMapCreateEvent)(SignupForm);