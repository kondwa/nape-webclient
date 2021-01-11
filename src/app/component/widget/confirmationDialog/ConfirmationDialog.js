import {injectIntl, intlShape} from "react-intl";

import Button from "@material-ui/core/Button";
import {Component} from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import PropTypes from "prop-types";
import React from "react";

class ConfirmationDialog extends Component {

    static propTypes = {
        title: PropTypes.string,
        message: PropTypes.string,
        confirmButtonText: PropTypes.string,
        cancelButtonText: PropTypes.string,
        denyButtonText: PropTypes.string,
        open: PropTypes.bool,
        children: PropTypes.node,
        onCancel: PropTypes.func,
        onDeny: PropTypes.func,
        onConfirm: PropTypes.func,
        intl: intlShape.isRequired
    };

    constructor(props) {
        super(props);
        this.handleCancel = ::this.handleCancel;
        this.handleDeny = :: this.handleDeny;
        this.handleConfirm = ::this.handleConfirm;

        this.state = {
            open: props.open
        };
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        this.setState({
            open: newProps.open
        });
    }

    handleCancel() {
        if (this.props.onCancel) {
            this.props.onCancel();
        }

        this.setState({
            open: false
        });
    }

    handleConfirm() {
        if (this.props.onConfirm) {
            this.props.onConfirm();
        }

        this.setState({
            open: false
        });
    }

    handleDeny() {
        if (this.props.onDeny) {
            this.props.onDeny();
        }

        this.setState({
            open: false
        });
    }

    render() {

        const {title, children, message, intl} = this.props;

        if (!this.state.open) {
            return (<div>{children}</div>);
        }

        let actions = [];

        if (this.props.onCancel) {
            actions.push(
                <Button
                    key="cancel"
                    onClick={this.handleCancel}
                >
                    {this.props.cancelButtonText ? this.props.cancelButtonText :
                        intl.formatMessage({"id": "confirmation.dialog.button.cancel"})}
                </Button>);
        }

        if (this.props.onDeny) {
            actions.push(
                <Button
                    key="deny"
                    onClick={this.handleDeny}
                >
                    {this.props.denyButtonText ? this.props.denyButtonText :
                        intl.formatMessage({"id": "confirmation.dialog.button.deny"})}
                </Button>);
        }

        if (this.props.onConfirm) {
            actions.push(
                <Button
                    color="primary"
                    key="confirm"
                    onClick={this.handleConfirm}
                >
                    {this.props.confirmButtonText ? this.props.confirmButtonText :
                        intl.formatMessage({"id": "confirmation.dialog.button.confirm"})}
                </Button>);
        }

        if (!this.props.onCancel && !this.props.onCancel) {
            actions.push(
                <Button
                    key="confirm"
                    onClick={this.handleConfirm}
                >
                    {intl.formatMessage({"id": "confirmation.dialog.button.confirm"})}
                </Button>);
        }

        return (
            <div>

                {children}

                <Dialog
                    open={this.state.open}
                    disableBackdropClick
                    disableEscapeKeyDown
                >
                    <DialogTitle>{title}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {message}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        {actions}
                    </DialogActions>
                </Dialog>

            </div>
        );
    }
}

export default injectIntl(ConfirmationDialog);
