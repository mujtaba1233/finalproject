import React from "react";
import LoginForm from "../../components/user/login-form";

export default class LoginContainer extends React.Component {
    constructor(props) {
        super(props);
        // this.handleChange = this.handleChange.bind(this);
    }
    render() {
        return (
            <div>
                <div className="main-content">
                    <LoginForm history={this.props.history} />
                </div>
            </div>
        )
    }
}
