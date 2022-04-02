import React from "react";
import { connect } from "react-redux";
import EmailConfirmForm from "../../components/user/email-confirm/email-confirm";

 class EmailConfirmContainer extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <div className="main-content">
          <EmailConfirmForm {...this.props} />
        </div>
      </div>
    );
  }
}
const stateMap = (state) => {
  return {
    showResetPasswordForm: state.global.showResetPasswordForm,

  };
};
export default connect(stateMap)(EmailConfirmContainer);

