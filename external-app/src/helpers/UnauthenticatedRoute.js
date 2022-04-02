import React from "react";
import { Route, Redirect } from "react-router-dom";
import { TO_LOGIN, TO_QUOTE_LIST } from "./constants";

export default ({ component: C, appProps, ...rest }) =>
    <Route
        {...rest}
        exact
        render={props =>
            !appProps.isAuthenticated
                ? <C {...props} {...appProps} />
                : <Redirect to={TO_QUOTE_LIST} />}
    />;