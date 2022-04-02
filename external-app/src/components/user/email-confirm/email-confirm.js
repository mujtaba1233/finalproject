import React, { Component } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { IN_PROCESS, TO_LOGIN } from "../../../helpers/constants";
import "../password-set/password-set.scss";
import store from "../../../store";
import { VerifyToken } from "../../../actions/user/login";

class EmailConfirm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {
        token: ''
      },
      initial: true,
    }
  }
  componentWillMount() {
    store.dispatch({ type: IN_PROCESS, payload: true });
  }
  componentDidMount() {
    store.dispatch({ type: IN_PROCESS, payload: true });
    store.dispatch(VerifyToken({ data: this.props.match.params.token }))
    let user = this.state.user
    user.token = this.props.match.params.token
    this.setState({
      user: user
    })
    console.log("yooo")
  }
  componentDidUpdate(prevProps) {
    console.log(this.props.showResetPasswordForm, "yooo")

    if (prevProps.showResetPasswordForm !== this.props.showResetPasswordForm) {
      console.log(this.props.showResetPasswordForm)
      this.setState({ initial: false })
    }
  }
  render() {
    const mystyle= {
      fontSize: "32px",
      color: "#0071BB",
      margin: "0 -15px 1rem -15px",
      fontWeight: "600"
     }
    return (
      <div className="reset-form justify-content-sm-center">
        {/* <Container>
          <Col sm={6} md={4} className="mx-auto">
            <Container fluid>
              <img
                className="mb-4 mt-5"
                src={require("../../../assets/images/logo.png")}
                alt="logo"
              />
              {this.props.showResetPasswordForm && <><h3 className="text-center" style={mystyle}>Email Verify Successfull</h3>
                <p className="text-center text-muted mb-5">
                  <Link to={TO_LOGIN}>Go back to Sign in</Link>
                </p></>}
              {!this.props.showResetPasswordForm && !this.state.initial && <><h3 className="text-center text-danger">Invalid token</h3><p className="text-center text-muted mb-5">
                Given URL is already used or invalid.
              </p></>}

            </Container>
          </Col>
        </Container> */}
        <div className="justify-content-md-center ">
          <div className="container">
            <div style={{ height: '100vh' }} className="row align-items-center">
              <div className="col-sm-8 col-md-6 mx-auto">
                <div class="card text-center shadow-lg p-3 bg-white rounded"  >
                  <div class="card-body">
                    <img
                      className="mb-3 mt-2"
                      src={require("../../../assets/images/logo.png")}
                      alt="logo"
                    />
                    {this.props.showResetPasswordForm && <><h3 className="text-center" style={mystyle}>Email Verified Successfully</h3>
                <p className="text-center text-muted mb-5">
                  <Link to={TO_LOGIN}>Go back to Sign in</Link>
                </p></>}
                {!this.props.showResetPasswordForm && !this.state.initial && <><h3 className="text-center text-danger">Invalid token</h3><p className="text-center text-muted mb-5">
                Given URL is already used or invalid.
                </p></>}
                 </div>
                </div>
              </div>
            </div>
          </div>
        </div>





      </div>
    );
  }
}

export default EmailConfirm;
