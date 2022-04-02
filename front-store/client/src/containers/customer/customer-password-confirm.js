import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PasswordConfirm from "../../components/password-confirm";
import { customerForgetPassword,tokenVerification } from '../../actions/customerAction';
import store from '../../store';
import { IN_PROCESS } from '../../helpers/actionConstants';
import { connect } from 'react-redux';

class ForgetPasswordContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            valid: false
        }
    }
    componentDidMount() {
        if (this.props.match.params.token.length === 64) {
            this.setState({ valid: true })
            store.dispatch({ type: IN_PROCESS, payload: true });
            store.dispatch(tokenVerification({token:this.props.match.params.token}));
        }
    }
    componentDidUpdate() {
        store.dispatch({ type: IN_PROCESS, payload: true });
        store.dispatch(tokenVerification({token:this.props.match.params.token}));
    }
    render() {
        return (
            <div id="content">
                <div className="container">
                    <div className="row">
                        {this.props.tokenVerified && <div className="reset-pass-block">
                            <PasswordConfirm token={this.props.match.params.token} />
                        </div>}
                        {!this.props.tokenVerified && <div className="reset-pass-block">
                           <span>Seems to be invalid URL or already used.</span>
                        </div>}

                                         
                    </div>
                </div>
            </div >
        );
    }
}
const stateMapTokenVerificationContainer = (state) => {
    return {
        tokenVerified: state.customer.tokenVerification,
    };
};
export default connect(stateMapTokenVerificationContainer)(ForgetPasswordContainer);