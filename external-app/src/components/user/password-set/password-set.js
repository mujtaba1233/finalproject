import React, { Component } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { IN_PROCESS, TO_LOGIN } from "../../../helpers/constants";
import { password, required } from "../../../helpers/form-validation";
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import "./password-set.scss";
import store from "../../../store";
import { SetPasswordAction, VerifyToken } from "../../../actions/user/login";

class PasswordResetForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {
        password: '',
        token: ''
      },
      initial: true,
    }
  }
  componentWillMount() {
    store.dispatch({ type: IN_PROCESS, payload: true });
  }
  handleOnSubmit = (e) => {
    e.preventDefault();
    this.form.validateAll()
    if (this.form.getChildContext()._errors.length === 0) {
      store.dispatch(SetPasswordAction(this.state.user)) //set in session storage
    }
  };
  componentDidMount() {
    store.dispatch({ type: IN_PROCESS, payload: true });
    store.dispatch(VerifyToken({ data: this.props.match.params.token }))
    let user = this.state.user
    user.token = this.props.match.params.token
    this.setState({
      user: user
    })
    // store.dispatch(SetPasswordAction(this.state.user)) //set in session storage
  }
  componentDidUpdate(prevProps) {
    if (prevProps.showResetPasswordForm !== this.props.showResetPasswordForm) {
      this.setState({ initial: false })

    }
  }
  handleChange = (e) => {
    let user = this.state.user
    user[e.target.name] = e.target.value
    this.setState({
      user: user
    })
  }
  render() {
    const styleHeading = {
      fontSize: "32px",
      color: "#0071BB",
      margin: "0 - 15px 1rem - 15px",
      fontWeight: "600"
    }
    return (
      <div className = "justify-content-lg-center">
        {/* <Container>
          <Col sm={6} md={4} className="mx-auto">
            <Container fluid>
              <img
                className="mb-4 mt-5"
                src={require("../../../assets/images/logo.png")}
                alt="logo"
              />
              {this.props.showResetPasswordForm && <><h3 className="text-center">Set your Password </h3>
                <p className="text-center text-muted mb-5">
                  Enter password to set a new password
                </p></>}
              {!this.props.showResetPasswordForm && !this.state.initial && <><h3 className="text-center text-danger">Invalid token</h3><p className="text-center text-muted mb-5">
                Given URL is already used or invalid.
              </p></>}
              <Form ref={c => { this.form = c }} onSubmit={this.handleOnSubmit}>
                {this.props.showResetPasswordForm && <Row>
                  <Col className=" p-0 mb-1">
                    <Input validations={[password]} className='input form-control' type='password' value={this.state.user.password} name="password" onChange={this.handleChange} placeholder='Password' />
                  </Col>
                </Row>}
                <Row>
                  {this.props.showResetPasswordForm && <> <Col className=" p-0 mb-3">
                    <Input validations={[required]} className='input form-control' type='password' value={this.state.user.confirmPassword} name="confirmPassword" onChange={this.handleChange} placeholder='Confirm Password' />
                  </Col>
                    <Col xs={12} className="mt-3 mb-2">
                      <Button type="submit" block> Submit </Button>
                    </Col></>}
                  <Col>
                    <p className="text-center mt-3">
                      <Link to={TO_LOGIN}>Go back to Sign in</Link>
                    </p>
                  </Col>
                </Row>
              </Form>
            </Container>
          </Col>
        </Container> */}

        < div className="justify-content-lg-center " >
          <div className="container">
            <div style={{ height: '100vh' }} className="row align-items-center">
              <div className="col-sm-8 col-md-6 mx-auto">
                <div class="card text-center shadow-lg p-3 bg-white rounded"  >
                  <div class="card-body">
                    <img
                      className="mb-4 mt-3 img-fluid"
                      src={require("../../../assets/images/logo.png")}
                      alt="logo"
                    />
                    {this.props.showResetPasswordForm && <><h3 className="text-center" style={styleHeading}>Set your Password </h3>
                      <p className="text-center text-muted mb-5">
                        Enter password to set a new password
                      </p></>}
                    {!this.props.showResetPasswordForm && !this.state.initial && <><h3 className="text-center text-danger">Invalid token</h3><p className="text-center text-muted mb-5">
                      Given URL is already used or invalid.
                    </p></>}
                    <Form ref={c => { this.form = c }} onSubmit={this.handleOnSubmit}>
                      {this.props.showResetPasswordForm && <Row>
                        <Col className=" p-0 mb-1">
                          <Input validations={[password]} className='input form-control' type='password' value={this.state.user.password} name="password" onChange={this.handleChange} placeholder='Password' />
                        </Col>
                      </Row>}
                      <Row>
                        {this.props.showResetPasswordForm && <> <Col className=" p-0 mb-3">
                          <Input validations={[required]} className='input form-control' type='password' value={this.state.user.confirmPassword} name="confirmPassword" onChange={this.handleChange} placeholder='Confirm Password' />
                        </Col>
                          <Col xs={12} className="mt-3 mb-2">
                            <Button type="submit" block> Submit </Button>
                          </Col></>}
                        <Col>
                          <p className="text-center mt-3">
                            <Link to={TO_LOGIN}>Go back to Sign in</Link>
                          </p>
                        </Col>
                      </Row>
                    </Form>
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

export default PasswordResetForm;
