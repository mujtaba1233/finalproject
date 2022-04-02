import React from "react";
import Logo from "../../components/logo/logo";

export default class LandingPageContainer extends React.Component {
    render() {
        return (
            <div className="main-content logo">
                <Logo history={this.props.history} />
            </div>
        )
    }
}
