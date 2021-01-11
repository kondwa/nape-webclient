import {Cookies, withCookies} from "react-cookie";

import React, {Component} from "react";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import MLWrapper from "../../widget/wrapper/MLWrapper";
import Paper from "@material-ui/core/Paper";
import PropTypes from "prop-types";
import {Redirect} from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import VerifiedUser from "@material-ui/icons/VerifiedUser";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import {withStyles} from "@material-ui/core/styles";

const styles = theme => ({

    background: {
        background: "url(\"/images/login/login.jpg\") no-repeat center center fixed",
        backgroundSize: "cover",
        opacity: ".6",
        width: "100%",
        minHeight: "100%",
        height: "100vh",
        position: "absolute",
    },
    header: {
        height: "100vh",
        alignContent: "center",
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
    },
    paper: {
        width: "47.8em",
        margin: "auto",
        zIndex: 1
    },
    paperHead: {
        background: "url(\"/images/login/logo_small.png\") no-repeat center bottom",
        height: 120
    },
    field: {
        padding: "0 40px"
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    loginButton: {
        width: 240,
        height: 57,
        margin: "20px 40px",
        color: "white",
    }
});

class Login extends Component {

    static propTypes = {
        doLogin: PropTypes.func,
        changeUsername: PropTypes.func,
        changePassword: PropTypes.func,
        showHide: PropTypes.func,
        username: PropTypes.string,
        password: PropTypes.string,
        showPassword: PropTypes.bool,
        userIsLoggedIn: PropTypes.bool,
        cookies: PropTypes.instanceOf(Cookies).isRequired,
        checkCookieLogin: PropTypes.func.isRequired,
        classes: PropTypes.object
    };

    static defaultProps = {
        username: "",
        password: ""
    };

    constructor(props) {
        super(props);
        this.handleShowHide = ::this.handleShowHide;
        this.handleUsernameChanged = ::this.handleUsernameChanged;
        this.handlePasswordChanged = ::this.handlePasswordChanged;
        this.handleCheckForKeyEventLogin = ::this.handleCheckForKeyEventLogin;
        this.handleLogin = :: this.handleLogin;
    }

    UNSAFE_componentWillMount() {
        this.props.checkCookieLogin(this.props.cookies);
    }

    handleShowHide() {
        const {showPassword, showHide} = this.props;
        showHide(showPassword);
    }

    handleUsernameChanged(event) {
        const {changeUsername} = this.props;
        changeUsername(event.target.value);
    }

    handlePasswordChanged(event) {
        const {changePassword} = this.props;
        changePassword(event.target.value);
    }

    handleCheckForKeyEventLogin(event) {
        const {doLogin} = this.props;
        if (event.key && event.key.toUpperCase() === "ENTER") {
            doLogin(this.props.cookies);
        }
    }

    handleLogin() {
        this.props.doLogin(this.props.cookies);
    }

    render() {
        const {showPassword, username, password, userIsLoggedIn, classes} = this.props;

        return (
            !userIsLoggedIn ?
                (
                    <MLWrapper>
                        <div className={classes.background}/>

                        <div className={classes.header}>

                            <Paper className={classes.paper}>
                                <div className={classes.paperHead}/>

                                <div className={classes.field}>

                                    <TextField
                                        style={{margin: 10}}
                                        type="text"
                                        label="Username"
                                        value={username}
                                        onChange={this.handleUsernameChanged}
                                        onKeyPress={this.handleCheckForKeyEventLogin}
                                        fullWidth
                                    />
                                    <TextField
                                        style={{margin: 10}}
                                        fullWidth
                                        type={showPassword ? "text" : "password"}
                                        label="Password"
                                        value={password}
                                        onChange={this.handlePasswordChanged}
                                        onKeyPress={this.handleCheckForKeyEventLogin}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={this.handleShowHide}
                                                    >
                                                        {showPassword ? <VisibilityOff/> : <Visibility/>}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </div>

                                <Button
                                    variant="contained"
                                    color="primary"
                                    className={classes.loginButton}
                                    onClick={this.handleLogin}
                                >
                                    <VerifiedUser className={classes.leftIcon}/>
                                    {"Login"}
                                </Button>
                            </Paper>
                        </div>
                    </MLWrapper>

                ) : <Redirect to="/home"/>
        );
    }
}

export default withStyles(styles)(withCookies(Login));
