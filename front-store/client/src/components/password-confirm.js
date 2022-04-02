import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { TO_REGISTER, TO_LOGIN } from "../helpers/routesConstants";
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import { required, email, min8, password } from '../helpers/form-validation';
import { IN_PROCESS, PASSWORD_UPDATE_STATUS } from '../helpers/actionConstants';
import store from '../store';
import { connect } from 'react-redux';
import { forgotPasswordUpdated } from '../actions/customerAction';

class PasswordConfirm extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            passwords: {
                password: '',
                confirmPassword: '',
                token: ''
            },
            password: false,
            confirmPassword: false,
            token: this.props.token,
            disable: false
        }
        this.baseState = this.state
    }
    handleChange(event) {
        let passwords = { ...this.state.passwords };
        passwords[event.target.name] = event.target.value;
        this.setState({ passwords });
    }
    handleChangePasswordSubmit = (event) => {
        event.preventDefault();
        const errors = this.form.validateAll()
        if (this.form.getChildContext()._errors.length === 0) {
            var data = {
                passwords: this.state.passwords,
                token: this.state.token
            }
            // data.email = this.props.customer.EmailAddress
            store.dispatch({ type: IN_PROCESS, payload: true });
            store.dispatch(forgotPasswordUpdated(data))
        } else {
            // console.log('have errors', this.form.getChildContext()._errors);
        }
    };
    componentDidMount(){
        if (this.props.passwordUpdateStatus.code) {
            store.dispatch({
                type: PASSWORD_UPDATE_STATUS,
                payload: {}
            });
        }
    }
    componentDidUpdate(prevProps,){
        // console.log(this.props.passwordUpdateStatus);
        
        if (JSON.stringify(prevProps.passwordUpdateStatus) !== JSON.stringify(this.props.passwordUpdateStatus) && this.props.passwordUpdateStatus.code === 200 && this.props.passwordUpdateStatus.status) {
            this.setState({disable:true})
        }
    }
    render() {
        return (
            <div className="col-lg-12">
                <div className="box">
                    <h2 className="text-uppercase text-center">Reset Password</h2>
                    <hr></hr>
                    <div className="col-lg-6 mx-auto">
                        <Form ref={c => { this.form = c }} onSubmit={this.handleChangePasswordSubmit.bind(this)}>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <Input validations={[required, min8, password]} id="password" value={this.state.passwords.password} name="password" type="password" onChange={this.handleChange} className="form-control"></Input>
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Confirm Password</label>
                                <Input validations={[required]} id="confirmPassword" value={this.state.passwords.confirmPassword} name="confirmPassword" type="password" onChange={this.handleChange} className="form-control"></Input>
                            </div>
                            <div className="text-center">
                                <button type="submit" disabled={this.state.disable} className="btn btn-template-outlined"><i className="fa fa-sign-in"></i> Send</button>
                            </div>
                        </Form>
                        <div className="col-md-12 mt-4">
                            {!this.props.inProcess && this.props.passwordUpdateStatus.status && this.props.passwordUpdateStatus.code === 200 && (
                                <div className="alert alert-success">
                                    <strong>Success!</strong> <span>{this.props.passwordUpdateStatus.msg}, Click here to <Link to={TO_LOGIN}>SIGN IN</Link></span>
                                </div>
                            )}
                            {!this.props.inProcess && this.props.passwordUpdateStatus.status && this.props.passwordUpdateStatus.code === 400 && (
                                <div className="alert alert-danger">
                                    <strong>Whoops!</strong> <span> {this.props.passwordUpdateStatus.msg}</span>
                                </div>
                            )}
                            {!this.props.inProcess && this.props.passwordUpdateStatus.status === false && (
                                <div className="alert alert-danger">
                                    <strong>Whoops!</strong> <span> Something went wrong, try again.</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
const stateMapResetPasswordContainer = (state) => {
    return {
        passwordUpdateStatus: state.global.passwordUpdateStatus,
        inProcess: state.global.inProcess,
    };
};
export default connect(stateMapResetPasswordContainer)(PasswordConfirm);