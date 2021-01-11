import Divider from "@material-ui/core/Divider";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import some from "lodash/some";

class MLDivider extends React.Component {
    constructor( props ) {
        super(props);
    }

    render() {
        const { roles, userRoles } = this.props;
        return (
            some(roles, ( r ) => userRoles.indexOf(r) > -1) ?
                <Divider/> : null
        );
    }
}

MLDivider.propTypes = {
    roles: PropTypes.array,
    userRoles: PropTypes.array

};

const mapStateToProps = ( state, ownProps ) => {
    return {
        userRoles: ownProps.userRoles,
        roles: state.login.roles
    };
};

export default connect(mapStateToProps)(MLDivider);
