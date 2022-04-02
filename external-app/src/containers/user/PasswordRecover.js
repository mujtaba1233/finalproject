import React from "react";
import { connect } from "react-redux";
import PasswordResetForm from "../../components/user/password-recover/password-recover";

 class PasswordResetContainer extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <div className="main-content">
          <PasswordResetForm {...this.props} />
        </div>
      </div>
    );
  }
}
const stateMap = (state) => {
  return {
    inProcess: state.global.inProcess,
  };
};
export default connect(stateMap)(PasswordResetContainer);

