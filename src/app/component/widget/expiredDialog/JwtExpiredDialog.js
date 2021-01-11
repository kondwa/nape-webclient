import {Cookies, withCookies} from "react-cookie";

import Button from "@material-ui/core/Button";
import {COOKIE_LOGIN} from "../../../services/login";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import PropTypes from "prop-types";
import React from "react";

class JwtExpiredDialog extends React.Component {

    static propTypes = {
        cookies: PropTypes.instanceOf(Cookies).isRequired,
        show: PropTypes.bool.isRequired,
        onClose: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.handleClose = ::this.handleClose;
    }

    handleClose = () => {
        this.props.cookies.remove(COOKIE_LOGIN);
        this.props.onClose();
    };

    render() {

        let {show} = this.props;

        return (
            <Dialog
                open={show}
                disableBackdropClick
                disableEscapeKeyDown
            >
                <DialogTitle>{"Session has expired"}</DialogTitle>

                <DialogContent>
                    {"Your session has expired, please log in again!"}
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={this.handleClose}
                        href="/"
                    >
                        {"Ok"}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

}

export default withCookies(JwtExpiredDialog);
