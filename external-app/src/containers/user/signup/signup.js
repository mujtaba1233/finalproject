import React from "react";
import SignupForm from "../../../components/user/signup-form/signup-form";

export default class SignupContainer extends React.Component {
    constructor(props) {
        super(props);
        // this.handleChange = this.handleChange.bind(this);
    }
    render() {
        return (
            <div>
                <div className="main-content">
                    <SignupForm {...this.props} />
                </div>
            </div>
        )
    }
}
