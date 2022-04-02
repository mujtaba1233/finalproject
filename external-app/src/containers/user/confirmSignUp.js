import React from "react";
import { TO_LOGIN } from "../../helpers/constants";
import { Link } from "react-router-dom";
import store from "../../store";
import { ConfirmSignUpAction } from "../../actions/user/register";
import { connect } from "react-redux";
import { toast } from "../../helpers/utility";

class ConfirmSignup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            res: {}
        }
    }
    async componentDidMount() {
        console.log(this.props.match.params.token);
        if (this.props.match.params.token) {
            store.dispatch(ConfirmSignUpAction(this.props.match.params.token))
        }
    }
    componentDidUpdate(prevProps) {
        if (JSON.stringify(this.props.message) !== JSON.stringify(prevProps.message)) {
            toast(this.props.message)
        }
    }
    render() {
        return (
            <div>
                <div className="container custom-container">
                        {/* {this.props.message} */}
                        <Link to={TO_LOGIN}> Login</Link>
                </div>
            </div>
        );
    }
}
const stateMap = (state) => {
    return {
        message: state.user.confirmSignUpMessage
    };
};
export default connect(stateMap)(ConfirmSignup);