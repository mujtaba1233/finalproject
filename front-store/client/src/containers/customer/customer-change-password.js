import React, { Component } from 'react';
import { connect } from 'react-redux';
import CustomerSectionTabs from '../../components/customer-section-tabs'
import { TO_LOGIN, TO_CUSTOMER_ACCOUNT } from '../../helpers/routesConstants';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import store from '../../store';
import { customerPasswordChange } from '../../actions/customerAction';
import { IN_PROCESS, PASSWORD_UPDATE_STATUS } from '../../helpers/actionConstants';
import { required, min8, password } from '../../helpers/form-validation';

class CustomerAccountContainer extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            passwords: {
                oldPassword: '',
                password: '',
                confirmPassword: ''
            },
            oldPassword: false,
            password: false,
            confirmPassword: false,
            disable:false
        }
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
            var data = this.state.passwords
            data.email = this.props.customer.EmailAddress
            store.dispatch({ type: IN_PROCESS, payload: true });
            store.dispatch(customerPasswordChange(data))
        } else {
            // console.log('have errors', this.form.getChildContext()._errors);
        }
    };
    componentDidMount() {
        if (this.props.passwordUpdateStatus.code) {
            store.dispatch({
                type: PASSWORD_UPDATE_STATUS,
                payload: {}
            });
        }
    }
    componentWillMount() {

    }
    componentDidUpdate(prevProps) {
        if (prevProps.isLoggedIn !== this.props.isLoggedIn && !this.props.isLoggedIn) {
            this.props.history.push(TO_LOGIN)
        }
        if (JSON.stringify(prevProps.passwordUpdateStatus) !== JSON.stringify(this.props.passwordUpdateStatus) && this.props.passwordUpdateStatus.code === 200 && this.props.passwordUpdateStatus.status) {
            // this.setState({ disable: true })
            this.props.history.push(TO_CUSTOMER_ACCOUNT)
        }
    }
    render() {
        return (
            <div id="content">
                <div className="container">
                    <div className="row bar">
                        <div id="customer-account" className="col-lg-9 clearfix">
                            <p className="lead">Change your password here.</p>
                            {/* <p className="text-muted">Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</p> */}
                            <div className="box mt-5">
                                <div className="heading">
                                    <h3 className="text-uppercase">Change password</h3>
                                </div>
                                <Form ref={c => { this.form = c }} onSubmit={this.handleChangePasswordSubmit.bind(this)}>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="password_old">Current Password</label>
                                                <Input validations={[required]} name="oldPassword" onChange={this.handleChange} value={this.state.passwords.oldPassword} id="password_old" type="password" className="form-control"></Input>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="password_1">New Password</label>
                                                <Input validations={[required, min8, password]} name="password" onChange={this.handleChange} value={this.state.passwords.password} id="password_1" type="password" className="form-control"></Input>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="password_2">Confirm New Password</label>
                                                <Input name="confirmPassword" onChange={this.handleChange} value={this.state.passwords.confirmPassword} id="password_2" type="password" className="form-control"></Input>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12">
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
                                    <div className="text-center">
                                        <button type="submit" disabled={this.state.disable} className={(this.state.disable ? 'btn btn-template-outlined disabled' : 'btn btn-template-outlined')}><i className="fa fa-save"></i> Save new password</button>
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
        passwordUpdateStatus: state.global.passwordUpdateStatus,
        customer: state.customer.customer.result,
        products: state.product.products,
    };
};

export default connect(stateMap)(CustomerAccountContainer);

