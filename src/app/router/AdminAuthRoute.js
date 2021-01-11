import * as ROUTES from "../common/routes";

import {Redirect, Route, withRouter} from "react-router-dom";

import React from "react";
import {connect} from "react-redux";
import {isAdmin} from "./selectors/isAdmin";
import {isLoggedIn} from "./selectors/auth";

const AdminAuthRoute = ({component: Component, isLoggedIn, isAdmin, ...rest}) => {
    const renderFn = props => {
        if (isLoggedIn && isAdmin) {
            return <Component {...props}/>;
        }

        return <Redirect to={ROUTES.DEFAULT_LOGGED_IN}/>
    };

    return <Route {...rest} render={renderFn}/>;
};

const mapStateToProps = (state) => {
    return {
        isLoggedIn: isLoggedIn(state),
        isAdmin: isAdmin(state)
    };
};

export default withRouter(connect(mapStateToProps)(AdminAuthRoute));
