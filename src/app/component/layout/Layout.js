/*
 * Copyright (c) 2018 Mainlevel Consulting AG
 */
import "react-perfect-scrollbar/dist/css/styles.css";
import React, {PureComponent} from "react";
import Branding from "../../common/branding";
import CssBaseline from "@material-ui/core/CssBaseline";
import Footer from "./footer/Footer";
import Header from "./header/Header";
import LoginContainer from "../../container/LoginContainer";
import Main from "./main/Main";
import Navigation from "./drawer/Navigation";
import NotificationContainer from "../../container/NotificationContainer";
import PerfectScrollbar from "react-perfect-scrollbar";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {withStyles} from "@material-ui/core/styles/index";

const styles = () => ({

    root: {
        flexGrow: 1,
        zIndex: 1,
        overflow: "hidden",
        position: "relative",
        display: "flex",
        height: "inherit",
    },
    scrollbar: {
        width: "100%",
    }

});

const initialState = {
    drawerOpen: false
};

class Layout extends PureComponent {

    static propTypes = {
        userIsLoggedIn: PropTypes.bool,
        scrollTop: PropTypes.number,
        classes: PropTypes.object
    };

    constructor() {
        super();

        this.state = initialState;

        this.handleDrawerOpen = ::this.handleDrawerOpen;
        this.handleDrawerClose = ::this.handleDrawerClose;
    }

    handleDrawerOpen() {
        this.setState({drawerOpen: true});
    }

    handleDrawerClose() {
        this.setState({drawerOpen: false});
    }

    render() {

        const {classes} = this.props;

        if (this.scrollRef && this.props.scrollTop) {
            this.scrollRef.scrollTop = this.props.scrollTop;
        }

        return !this.props.userIsLoggedIn ? (

            <div>
                <CssBaseline/>

                <Branding/>

                <LoginContainer/>

                <NotificationContainer/>

            </div>

        ) : (

            <div className={classes.root}>

                <CssBaseline/>

                <Branding/>

                <Navigation
                    open={this.state.drawerOpen}
                    onOpen={this.handleDrawerOpen}
                    onClose={this.handleDrawerClose}
                />

                

                <PerfectScrollbar style={{width: "100%"}}>

                    <Header
                        drawerOpen={this.state.drawerOpen}
                        showLanguage
                    />

                    <Main/>

                    <Footer/>

                </PerfectScrollbar>


                <NotificationContainer/>

            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userIsLoggedIn: state.login.userIsLoggedIn,
        scrollTop: state.layout.scrollTop
    };
};

export default withRouter(connect(mapStateToProps)(withStyles(styles)(Layout)));
