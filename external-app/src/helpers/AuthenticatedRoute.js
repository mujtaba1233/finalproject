import React, { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";

export default function AuthenticatedRoute({ component: C, appProps, ...rest }) {
    useEffect(() => {
        let isMounted = true; // note this flag denote mount status
        return () => { isMounted = false }; // use effect cleanup to set flag false, if unmounted
    });
    return (
        <Route
            exact
            {...rest}
            render={props =>
                appProps.isAuthenticated
                    ? <C {...props} {...appProps} />
                    : <Redirect
                        to={appProps.to ? `${props.to}?redirect=${props.location.pathname}${props.location.search}` : `/login?redirect=${props.location.pathname}${props.location.search}`}
                    />}
        />
    );
}