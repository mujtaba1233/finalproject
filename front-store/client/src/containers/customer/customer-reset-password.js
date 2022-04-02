import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PasswordConfirm from "../../components/password-confirm";
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import { TO_LOGIN } from '../../helpers/routesConstants';
import { customerForgetPassword } from '../../actions/customerAction';
import store from '../../store';
import { required, email } from '../../helpers/form-validation';
import { IN_PROCESS, PASSWORD_UPDATE_STATUS } from '../../helpers/actionConstants';
import { connect } from 'react-redux';

class ResetPasswordContainer extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            user: {
                email: '',
            },
            email: false,
            disable: false
        }
        this.baseState = this.state
    }
    handleChange(event) {
        let user = { ...this.state.user };
        user[event.target.name] = event.target.value;
        this.setState({ user });
    }
    componentDidMount() {
        if (this.props.passwordUpdateStatus.code) {
            store.dispatch({
                type: PASSWORD_UPDATE_STATUS,
                payload: {}
            });
        }
    }
    handleSubmit = (event) => {
        event.preventDefault();
        this.form.validateAll()
        if (this.form.getChildContext()._errors.length === 0) {
            store.dispatch({ type: IN_PROCESS, payload: true });
            store.dispatch(customerForgetPassword(this.state.user));
        } else {
            console.log('form vali error', this.form.getChildContext()._errors);
        }
    };
    componentDidUpdate(prevProps, prevState) {
        if (JSON.stringify(prevProps.passwordUpdateStatus) !== JSON.stringify(this.props.passwordUpdateStatus) && this.props.passwordUpdateStatus.code === 200 && this.props.passwordUpdateStatus.status) {
            this.setState({ disable: true })
        }
    }

    render() {
        return (
            <div id="content">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="box">
                                <h2 className="text-uppercase">Reset Password</h2>
                                <hr></hr>
                                <Form ref={c => { this.form = c }} onSubmit={this.handleSubmit.bind(this)}>
                                    <div className="form-group">
                                        <label htmlFor="email">Email</label>
                                        <Input validations={[required, email]} id="email" name='email' value={this.state.user.email} type="text" onChange={this.handleChange} className="form-control"></Input>
                                    </div>

                                    <div className="text-center">
                                        <button type="submit" disabled={this.state.disable} className="btn btn-template-outlined"><i className="fa fa-sign-in"></i> Send</button>
                                    </div>
                                </Form>
                            </div>
                            <div>
                                {!this.props.inProcess && this.props.passwordUpdateStatus.status && this.props.passwordUpdateStatus.code === 200 && (
                                    <div className="alert alert-success">
                                        <strong>Success!</strong> <span>{this.props.passwordUpdateStatus.msg}</span>
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
                        <div className="col-lg-6">
                            <div className="box">
                                <h2 className="text-uppercase">Login</h2>
                                <p className="lead register-lead">Already our customer?</p>
                                <hr></hr>
                                <div className='text-center'>
                                    <Link to={TO_LOGIN} className="btn btn-template-outlined"><i className="fa fa-user"></i> Log in Here</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div >
        );
    }
}
const stateMapCustomerResetPasswordContainer = (state) => {
    return {
        passwordUpdateStatus: state.global.passwordUpdateStatus,
        inProcess: state.global.inProcess,
    };
};
export default connect(stateMapCustomerResetPasswordContainer)(ResetPasswordContainer);