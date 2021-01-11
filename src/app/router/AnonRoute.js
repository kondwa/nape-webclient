import * as ROUTES from "../common/routes";

import { Redirect, Route, withRouter } from "react-router-dom";

import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { isAdmin } from "./selectors/isAdmin";
import { isLoggedIn } from "./selectors/auth";

const AnonRoute = ( { component: Component, isLoggedIn, isAdmin, ...rest } ) => {
    const renderFn = props => {
        if ( !isLoggedIn ) {
            return <Component {...props}/>;
        }
        return isAdmin ?
            <Redirect
                to={ROUTES.DEFAULT_ADMIN}
                push
            /> :
            <Redirect
                to={ROUTES.DEFAULT_ADMIN}
                push
            />;
    };

    return (
        <Route
            {...rest}
            render={renderFn}
        />);
};

const mapStateToProps = ( state ) => {
    return {
        isLoggedIn: isLoggedIn(state),
        isAdmin: isAdmin(state)
    };
};

AnonRoute.propTypes = {
    isLoggedIn: PropTypes.bool,
    component: PropTypes.func,
    isAdmin: PropTypes.bool,
    location: PropTypes.object
};

export default withRouter(connect(mapStateToProps)(AnonRoute));
