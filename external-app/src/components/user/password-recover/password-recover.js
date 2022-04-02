import React, { Component } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { RecoverPasswordAction } from "../../../actions/user/login";
import { IN_PROCESS, TO_LOGIN } from "../../../helpers/constants";
import store from "../../../store";
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';

import "./password-reset.scss";
import { email } from "../../../helpers/form-validation";
import { toast } from "../../../helpers/utility";

class PasswordResetForm extends Component {
  constructor(props) {
    super(props)
    this.handleOnSubmit = this.handleOnSubmit.bind(this)
    this.state = {
      user: {
        email: '',
      }
    }
  }
  handleOnSubmit(e) {
    e.preventDefault();
    console.log(this.form);
    this.form.validateAll()
    if (this.form.getChildContext()._errors.length === 0) {
      // store.dispatch({ type: IN_PROCESS, payload: true });
      console.log(this.state.user)
      if (this.state.user.email)
        store.dispatch(RecoverPasswordAction(this.state.user)) //set in session storage
      else toast("Email is required.", "error")
    }
  };
  componentDidUpdate(prevProps) {
    if (prevProps.inProcess !== this.props.inProcess) {
      if (!this.props.inProcess)
        this.setState({
          user: {
            email: '',
            data: ''
          }
        })
    }
  }
  handleChange = (e) => {
    var user = this.state.user
    user[e.target.name] = e.target.value
    user.data = e.target.value
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
  return(
      <div className = "justify-content-lg-center">
    {/* <Container>
          <Col sm={6} md={4} className="mx-auto">
            <Container fluid>
              <img
                className="mb-4 mt-5"
                src={require("../../../assets/images/logo.png")}
                alt="logo"
              />
              <h3 className="text-center"> Reset your Password</h3>
              <p className="text-center text-muted mb-5">
                Enter your email address and we'll send you a link to reset your
                password
              </p>
              <Form ref={c => { this.form = c }} onSubmit={(data) => this.handleOnSubmit(data)}>
                <Row>
                  <Col xs={12} className="mb-2">
                    <Input className='input form-control' type='text' value={this.state.user.email} name="email" onChange={this.handleChange} placeholder='Email' />
                  </Col>
                  <Col xs={12} className="mt-3 mb-2">
                    <Button disabled={this.props.inProcess} type="submit" block> Recover </Button>
                  </Col>
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
      < div className = "justify-content-lg-center" >
        <div className="container">
          <div style={{ height: '100vh' }} className="row align-items-center">
            <div className="col-sm-8 col-md-6 mx-auto">
              <div class="card text-center shadow-lg p-3 bg-white rounded"  >
                <div class="card-body">
                  <img
                    className="mb-4 mt-2 img-fluid"
                    src={require("../../../assets/images/logo.png")}
                    alt="logo"
                  />
                  <h3 className="text-center" style={styleHeading}> <b> Reset your Password </b> </h3>
                  <p className="text-center text-muted mb-5">
                    Enter your email address and we'll send you a link to reset your
                    password
                  </p>
                  <Form ref={c => { this.form = c }} onSubmit={(data) => this.handleOnSubmit(data)}>
                    <Row>
                      <Col xs={12} className="mb-2">
                        <Input className='input form-control' type='text' value={this.state.user.email} name="email" onChange={this.handleChange} placeholder='Email' />
                      </Col>
                      <Col xs={12} className="mt-3 mb-2">
                        <Button disabled={this.props.inProcess} type="submit" block> Recover </Button>
                      </Col>
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

      </div >
    );
  }
}

export default PasswordResetForm;
