import PropTypes from "prop-types";
import React from "react";
import Snackbar from "@material-ui/core/Snackbar";

Notification.propTypes = {
    "open": PropTypes.bool.isRequired,
    "messageNode": PropTypes.node,
    "actionNode": PropTypes.node,
    "autoHideDuration": PropTypes.number.isRequired,
    "requestCloseCallback": PropTypes.func.isRequired
};

export default function Notification({open, messageNode, actionNode, autoHideDuration, requestCloseCallback}) {

    return (
        <Snackbar
            anchorOrigin={{vertical: "bottom", horizontal: "right"}}
            open={open}
            message={messageNode}
            autoHideDuration={autoHideDuration}
            action={actionNode}
            onClose={requestCloseCallback}
        />
    );

}
