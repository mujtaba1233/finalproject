import React from "react";
import { connect } from "react-redux";
import PasswordSetForm from "../../components/user/password-set/password-set";

class PasswordResetContainer extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <div className="main-content">
          <PasswordSetForm {...this.props} />
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
export default connect(stateMap)(PasswordResetContainer);
