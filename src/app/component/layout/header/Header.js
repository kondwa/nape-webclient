/*
 * Copyright (c) 2018 Mainlevel Consulting AG
 */
import * as ROUTES from "../../../common/routes";
import {COOKIE_LOGIN, logout} from "../../../services/login";
import React, {Component} from "react";
import {injectIntl, intlShape} from "react-intl";
import {DRAWER_WIDTH} from "../../../common/constant";
import IconButton from "@material-ui/core/IconButton";
import LocaleSelection from "../../widget/locale/LocaleSelection";
import LoginIcon from "@material-ui/icons/Input";
import LogoutIcon from "@material-ui/icons/PowerSettingsNew";
import PropTypes from "prop-types";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import {bindActionCreators} from "redux";
import {changeLocale} from "../../../services/locale";
import classNames from "classnames";
import {connect} from "react-redux";
import {withCookies} from "react-cookie";
import {withRouter} from "react-router-dom";
import {withStyles} from "@material-ui/core/styles/index";


const styles = theme => ({
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        width: "calc(100% - 70px)",
        left: "70px",
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: DRAWER_WIDTH - 70, // marginLeft insteadof left for transition
        width: `calc(100% - ${DRAWER_WIDTH}px)`,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    toolbar: {
        display: "flex",
        position: "absolute",
        justifyContent: "flex-end",
        alignItems: "baseline",
        padding: "0 8px",
        ...theme.mixins.toolbar,
    },
    box: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: 34,
        minWidth: 200,
        background: theme.palette.primary.main,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24
    },
    welcome: {
        color: "white",
        marginLeft: 10,
        marginRight: 10,
        maxWidth: 200,
        minWidth: 50,
        textOverflow: "ellipsis",
        overflow: "hidden",
        whiteSpace: "nowrap"
    },
    loginButton: {
        margin: "0 8px"
    }
});

class Header extends Component {

    static propTypes = {
        cookies: PropTypes.object,
        drawerOpen: PropTypes.bool,
        loggedIn: PropTypes.bool,
        locale: PropTypes.string,
        username: PropTypes.string,
        logout: PropTypes.func,
        changeLocale: PropTypes.func,
        classes: PropTypes.object,
        intl: intlShape.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            profileLoaded: false
        };

        this.handleLogin = :: this.handleLogin;
        this.handleLogout = :: this.handleLogout;
    }

    handleLogin() {
        // Not implemented!
    }

    handleLogout() {
        const {cookies, logout} = this.props;

        cookies.remove(COOKIE_LOGIN);

        logout();
    }

    render() {

        const {drawerOpen, loggedIn, classes, intl} = this.props;

        return (
            <div>
                <div
                    className={classNames(classes.toolbar,
                        classes.appBar, drawerOpen && classes.appBarShift)}
                >

                    <div className={classes.box}>

                        {this.props.username && (
                            <a
                                href={ROUTES.USER_PROFILE}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Typography
                                    className={classes.welcome}
                                    variant="body2"
                                >{this.props.username}</Typography>
                            </a>
                        )}

                        <LocaleSelection
                            localeList={["en", "de"]}
                            locale={this.props.locale}
                            changeLocale={this.props.changeLocale}
                        />

                        {loggedIn ?
                            <Tooltip title={intl.formatMessage({id: "common.label.logout"})}>
                                <IconButton
                                    color="secondary"
                                    className={classes.loginButton}
                                    onClick={this.handleLogout}
                                >
                                    <LogoutIcon/>
                                </IconButton>
                            </Tooltip> :
                            <Tooltip title={intl.formatMessage({id: "common.label.login"})}>
                                <IconButton
                                    color="secondary"
                                    className={classes.loginButton}
                                    onClick={this.handleLogin}
                                >
                                    <LoginIcon/>
                                </IconButton>
                            </Tooltip>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        locale: state.locale.locale,
        loggedIn: state.login.userIsLoggedIn,
        username: state.login.username
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({changeLocale, logout}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(withStyles(styles)(withCookies(Header)))));
