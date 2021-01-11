import * as ROUTES from "../../../common/routes";

import Button from "@material-ui/core/Button";
import { Component } from "react";
import Dashboard from "@material-ui/icons/Dashboard";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import { injectIntl } from "react-intl";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
    buttons: {
        marginRight: "0px",
        marginLeft: "30px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        minWidth: "20px"
    },
    leftIcon: {
        //marginRight: theme.spacing.unit,
        margin: theme.spacing.none,
    },
});


class DBBackButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {classes} = this.props;
        return (
            <Tooltip title="Back to Dashboard">
                <Button
                    className={classes.buttons}
                    color="secondary"
                    variant="contained"
                    component={Link}
                    to={ROUTES.projectDashboard()}
                >
                    <Dashboard className={classes.leftIcon} />
                </Button>
            </Tooltip>
        );
    }
}

DBBackButton.propTypes = {
    classes: PropTypes.object
};

export default injectIntl(withStyles(styles, { withTheme: true })(DBBackButton));
