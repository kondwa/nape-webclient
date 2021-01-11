import * as ROUTES from "../common/routes";

import { Redirect, Route, withRouter } from "react-router-dom";

import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { isLoggedIn } from "./selectors/auth";

const AuthRoute = ( { component: Component, isLoggedIn, ...rest } ) => {
    const renderFn = props => {
        if ( isLoggedIn ) {
            return <Component {...props}/>;
        }

        return <Redirect to={ROUTES.DEFAULT_ANONYMOUS}/>;
    };

    return (
        <Route
            {...rest}
            render={renderFn}
        />);
};

AuthRoute.propTypes = {
    isLoggedIn: PropTypes.bool,
    component: PropTypes.func
};

const mapStateToProps = ( state ) => {
    return {
        isLoggedIn: isLoggedIn(state)
    };
};

// TODO: Combine this and AnonRoute into one component
// Note: withRouter is needed to "break the blocker": https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/guides/blocked-updates.md
export default withRouter(connect(mapStateToProps)(AuthRoute));
