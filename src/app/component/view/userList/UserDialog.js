import Button from "@material-ui/core/Button";
import {Component} from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import MLWrapper from "../../widget/wrapper/MLWrapper";
import PropTypes from "prop-types";
import React from "react";
import TextField from "@material-ui/core/TextField";

const style = {
    textField: {
        "width": "200px"
    }
};

export default class UserDialog extends Component {

    static propTypes = {
        "title": PropTypes.string,
        "user": PropTypes.object,
        "children": PropTypes.node,
        "open": PropTypes.bool,
        "closeDialog": PropTypes.func
    };

    constructor(props) {
        super(props);
        this.handleClose = ::this.handleClose;
    }

    handleSave = () => {
        const {closeDialog} = this.props;
        closeDialog();
    };

    handleClose = () => {
        const {closeDialog} = this.props;
        closeDialog();
    };

    render() {

        const {title, open, user, children} = this.props;

        const actions = [
            <Button
                key="cancel"
                onClick={this.handleSave}
            >
                {"Cancel"}
            </Button>,
            <Button
                key="save"
                disabled
                onClick={this.handleClose}
            >
                {"Save"}
            </Button>
        ];

        return (
            <MLWrapper>
                {children}
                <Dialog open={open}>

                    <DialogTitle>{title}</DialogTitle>

                    <DialogContent>
                        <TextField
                            style={style.textField}
                            label="First Name"
                            value={user ? user.firstname : ""}
                            fullWidth
                            autoFocus
                        />

                        <TextField
                            style={style.textField}
                            label="Last Name"
                            value={user ? user.lastname : ""}
                            fullWidth
                        />

                        <TextField
                            style={style.textField}
                            label="E-Mail"
                            value={user ? user.username : ""}
                            fullWidth
                        />
                    </DialogContent>

                    <DialogActions>
                        {actions}
                    </DialogActions>
                </Dialog>
            </MLWrapper>
        );
    }
}
