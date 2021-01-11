import Button from "@material-ui/core/Button";
import { Component } from "react";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import includes from "lodash/includes";
import omit from "lodash/omit";
import some from "lodash/some";

class MLRaisedButton extends Component {
    constructor( props ) {
        super(props);
    }

    render() {
        const { roles, userRoles, buttonProps, visibleFromOutside } = this.props;
        const visible = some([ "ANONYMOUS" ], ( type ) => includes(visibleFromOutside, type));
        return (
            some(roles, ( r ) => userRoles.indexOf(r) > -1) || visible ?
                <Button
                    {...omit(buttonProps, [ "userRoles" ])}
                /> : null
        );
    }
}

MLRaisedButton.propTypes = {
    roles: PropTypes.array,
    userRoles: PropTypes.array,
    buttonProps: PropTypes.object,
    visibleFromOutside: PropTypes.string

};

const mapStateToProps = ( state, ownProps ) => {
    return {
        userRoles: ownProps.userRoles,
        roles: state.login.roles,
        buttonProps: ownProps,
        visibleFromOutside: state.surveyRunner.visibilityType
    };
};

export default connect(mapStateToProps)(MLRaisedButton);
