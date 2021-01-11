import PropTypes from "prop-types";
import {connect} from "react-redux";
import some from "lodash/some";

const MLMenuWrapper = (props) => {
    return (
        some(props.roles, (r) => props.userRoles.indexOf(r) > -1) ?
            props.children : null
    );
};

MLMenuWrapper.propTypes = {
    roles: PropTypes.array,
    userRoles: PropTypes.array,
};

const mapStateToProps = (state) => {
    return {
        roles: state.login.roles
    };
};

export default connect(mapStateToProps)(MLMenuWrapper);
