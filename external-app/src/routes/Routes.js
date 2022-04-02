import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import { TO_LOGIN, TO_SET_PASSWORD,TO_EMAIL_CONFIRM , TO_HOME,TO_RECOVER_PASSWORD, TO_QUOTE_LIST, TO_QUOTE_CREATE, TO_EXTERNAL_LOGIN } from "../helpers/constants"
import LoginContainer from "../containers/user/Login";
import SignupContainer from "../containers/user/signup/signup";
import { getToken } from "../helpers/utility";
import UnauthenticatedRoute from "../helpers/UnauthenticatedRoute";
import AuthenticatedRoute from "../helpers/AuthenticatedRoute";
import Container404 from "../containers/404/404";
import PasswordRecoverContainer from "../containers/user/PasswordRecover";
import PasswordSetContainer from "../containers/user/PasswordSet";
import SearchQuoteContainer from "../containers/quote/search";
import CreateQuoteContainer from "../containers/quote/create";
import EmailConfirmContainer from "../containers/user/EmailConfirm";


export default ({ socket }) => {
  let isAuthenticated = false
  try {
    const token = getToken();
    if (token)
      isAuthenticated = true
    else
      throw "User not authorized"
  } catch (e) {
    console.info(e)
  }
  return (

    <Switch>
      <Route exact path={TO_HOME} render={() => (<Redirect to={TO_QUOTE_LIST} />)} />
      <UnauthenticatedRoute exact path={TO_LOGIN} component={LoginContainer} appProps={{ isAuthenticated }} />
      <UnauthenticatedRoute exact path={TO_EXTERNAL_LOGIN} component={LoginContainer} appProps={{ isAuthenticated }} />
      <UnauthenticatedRoute exact path={TO_RECOVER_PASSWORD} component={PasswordRecoverContainer} appProps={{ isAuthenticated }} />
      <UnauthenticatedRoute exact path={TO_SET_PASSWORD} component={PasswordSetContainer} appProps={{ isAuthenticated }} />
      <UnauthenticatedRoute exact path={TO_EMAIL_CONFIRM} component={EmailConfirmContainer} appProps={{ isAuthenticated }} />
      <AuthenticatedRoute exact path={TO_QUOTE_LIST} component={SearchQuoteContainer} appProps={{ socket, isAuthenticated }} />
      <AuthenticatedRoute exact path={TO_QUOTE_CREATE+ '/:QuoteId?'} component={CreateQuoteContainer} appProps={{ socket, isAuthenticated }} />
      {/* <UnauthenticatedRoute exact path={TO_SIGNUP} component={SignupContainer} appProps={{ isAuthenticated }} /> */}
      {/* <UnauthenticatedRoute exact path={TO_HOME} component={LandingPageContainer} appProps={{ isAuthenticated }} /> */}
      <Route path={'*'} component={Container404} render={() => (<Redirect to={TO_QUOTE_LIST} />)} />
    </Switch>
  )
}
