import React, {Component} from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import omit from "lodash/omit";
import some from "lodash/some";
import {withStyles} from "@material-ui/core";

const styles = theme => ({
    label: {
        color: theme.palette.primary.contrastText
    }
});

class MLMenuItem extends Component {

    render() {
        const {roles, userRoles, classes, ...buttonProps} = this.props;
        return (
            some(roles, (r) => userRoles.indexOf(r) > -1) ?
                <ListItem
                    button
                    dense
                    {...omit(buttonProps, ["userRoles", "dispatch"])}
                >
                    <ListItemIcon>
                        {buttonProps.icon}
                    </ListItemIcon>
                    <ListItemText
                        primary={buttonProps.primary}
                        classes={{primary: classes.label}}
                    />
                </ListItem> : null
        );
    }
}

// Because muiName is static property -> break the DOM if not set in wrapper component
MLMenuItem.muiName = "MLMenuItem";

MLMenuItem.propTypes = {
    roles: PropTypes.array,
    userRoles: PropTypes.array,
    buttonProps: PropTypes.object,
    classes: PropTypes.object
};

const mapStateToProps = (state) => {
    return {
        roles: state.login.roles
    };
};

export default connect(mapStateToProps)(withStyles(styles)(MLMenuItem));
