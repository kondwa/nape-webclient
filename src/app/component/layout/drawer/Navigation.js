import * as ROUTES from "../../../common/routes";

import React, {Component} from "react";
import {injectIntl, intlShape} from "react-intl";

import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import {DRAWER_WIDTH} from "../../../common/constant";
import DashboardIcon from "@material-ui/icons/Dashboard";
import DataCollectionIcon from "@material-ui/icons/QuestionAnswer";
import Divider from "@material-ui/core/Divider";
import DocumentsIcon from "@material-ui/icons/AttachFile";
import Drawer from "@material-ui/core/Drawer";
import HomeIcon from "@material-ui/icons/Home";
import IconButton from "@material-ui/core/IconButton";
import {Link} from "react-router-dom";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import MLMenuItem from "../../widget/menuItem/MLMenuItem";
import MLMenuWrapper from "../../widget/menuItem/MLMenuWrapper";
import MenuIcon from "@material-ui/icons/Menu";
import MetadataIcon from "@material-ui/icons/Layers";
import PerfectScrollbar from "react-perfect-scrollbar";
import ProjectIcon from "@material-ui/icons/Work";
import PropTypes from "prop-types";
import ReportIcon from "@material-ui/icons/PieChart";
import ResultModelIcon from "mdi-material-ui/Sitemap";
import TemplateEditorIcon from "@material-ui/icons/Dns";
import Typography from "@material-ui/core/Typography";
import UserManagementIcon from "@material-ui/icons/Group";
import classNames from "classnames";
import {connect} from "react-redux";
import {withStyles} from "@material-ui/core/styles";

const styles = theme => ({
    drawerPaper: {
        position: "relative",
        minHeight: "100%",
        whiteSpace: "nowrap",
        background: theme.palette.primary.main,
        width: DRAWER_WIDTH,
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: "hidden",
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing.unit * 7,
        [theme.breakpoints.up("sm")]: {
            width: theme.spacing.unit * 9,
        },
    },
    logo: {
        maxWidth: 40
    },
    secondaryLogo: {
        maxWidth: 250,
        margin: "0 auto",
        height: 100
    },
    label: {
        color: theme.palette.primary.contrastText
    },
    nested: {
        paddingLeft: theme.spacing.unit * 5,
    },
    hide: {
        display: "none",
    },
    menuRoot: {
        height: "calc(100% - 100px)"
    },
    topMenu: {
        overflow: "hidden"
    },
    toolbar: {
        background: theme.palette.secondary.main,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-evenly",
        ...theme.mixins.toolbar,
    },
});

class Navigation extends Component {

    static propTypes = {
        open: PropTypes.bool,
        project: PropTypes.object,
        logo: PropTypes.string,
        title: PropTypes.string,
        secondaryLogo: PropTypes.string,
        direction: PropTypes.string,
        onOpen: PropTypes.func,
        onClose: PropTypes.func,
        classes: PropTypes.object,
        intl: intlShape.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            left: false,
            helpExpanded: false,
            systemExpanded: false,
        };
    }

    render() {
        // TODO I18N

        const {open, logo, secondaryLogo, project, classes, direction} = this.props;

        return (
            <Drawer
                open={open}

                variant="permanent"
                classes={{
                    paper: classNames(classes.drawerPaper, !open && classes.drawerPaperClose),
                }}
            >
                <div className={classes.toolbar}>

                    <img
                        alt="logo"
                        src={logo ? logo : "/images/header/logo_header.png"}
                        className={classNames(!open && classes.hide, classes.logo)}
                    />

                    <Typography
                        variant={"h6"}
                        classes={{h6: classes.label}}
                        className={classNames(!open && classes.hide)}
                    >
                        {this.props.title}
                    </Typography>

                    <IconButton
                        className={classNames(!open && classes.hide)}
                        onClick={this.props.onClose}
                    >
                        {direction === "ltr" ? <ChevronLeftIcon classes={{root: classes.label}}/> : <ChevronRightIcon classes={{root: classes.label}}/>}
                    </IconButton>

                    <IconButton
                        aria-label="open drawer"
                        className={classNames(open && classes.hide)}
                        onClick={this.props.onOpen}
                    >
                        <MenuIcon classes={{root: classes.label}}/>
                    </IconButton>
                </div>

                <Divider/>

                <PerfectScrollbar>

                    <div className={classes.menuRoot}>

                        <List
                            className={classes.topMenu}
                            classes={{
                                subheader: classes.subheader
                            }}
                        >

                            <Link to={"/dashboard"}>
                                <MLMenuItem
                                    button
                                    className={classes.menuItem}
                                    userRoles={["dashboard_viewer"]}
                                    primary={this.props.intl.formatMessage({"id": "drawer.home"})}
                                    icon={
                                        <HomeIcon
                                            color="secondary"
                                            classes={{root: classes.label}}
                                        />}
                                    onClick={this.handleClose}
                                />
                            </Link>

                            <Link to={"/projects"}>
                                <MLMenuItem
                                    button
                                    className={classes.menuItem}
                                    userRoles={["project_list_viewer"]}
                                    primary={this.props.intl.formatMessage({"id": "drawer.projects"})}
                                    icon={
                                        <ProjectIcon
                                            color="secondary"
                                            classes={{root: classes.label}}
                                        />}
                                    onClick={this.handleClose}
                                />
                            </Link>

                            {project ? (

                                <MLMenuWrapper
                                    userRoles={["project_viewer"]}
                                >
                                    <ListSubheader classes={{root: classes.label}}>
                                        {open ? this.props.intl.formatMessage({"id": "drawer.project"}, {"foreignId":project.foreignId}) : "\u00A0"}
                                    </ListSubheader>

                                    <Link to={ROUTES.projectDashboard(project.foreignId)}>
                                        <MLMenuItem
                                            button
                                            className={classes.menuItem}
                                            userRoles={["project_viewer"]}
                                            primary={this.props.intl.formatMessage({"id": "drawer.dashboard"})}
                                            icon={
                                                <DashboardIcon
                                                    color="secondary"
                                                    classes={{root: classes.label}}
                                                />}
                                            onClick={this.handleClose}
                                        />
                                    </Link>

                                    <Link to={ROUTES.resultModels(project.foreignId)}>
                                        <MLMenuItem
                                            button
                                            className={classes.menuItem}
                                            userRoles={["results_viewer"]}
                                            primary={this.props.intl.formatMessage({"id": "resultModellist.title"})}
                                            icon={
                                                <ResultModelIcon
                                                    color="secondary"
                                                    classes={{root: classes.label}}
                                                />}
                                            onClick={this.handleClose}
                                        />
                                    </Link>

                                    <Link to={ROUTES.documents(project.foreignId)}>
                                        <MLMenuItem
                                            button
                                            className={classes.menuItem}
                                            userRoles={["documents_viewer"]}
                                            primary={this.props.intl.formatMessage({"id": "drawer.documents"})}
                                            icon={
                                                <DocumentsIcon
                                                    color="secondary"
                                                    classes={{root: classes.label}}
                                                />}
                                            onClick={this.handleClose}
                                        />
                                    </Link>

                                    <Link to={ROUTES.surveys(project.foreignId)}>
                                        <MLMenuItem
                                            button
                                            className={classes.menuItem}
                                            userRoles={["survey_viewer"]}
                                            primary={this.props.intl.formatMessage({"id": "datacollection.title"})}
                                            icon={
                                                <DataCollectionIcon
                                                    color="secondary"
                                                    classes={{root: classes.label}}
                                                />}
                                            onClick={this.handleClose}
                                        />
                                    </Link>

                                    <Link to={ROUTES.indicators(project.foreignId)}>
                                        <MLMenuItem
                                            button
                                            className={classes.menuItem}
                                            userRoles={["report_ind_viewer"]}
                                            icon={
                                                <ReportIcon
                                                    color="secondary"
                                                    classes={{root: classes.label}}
                                                />}
                                            primary={this.props.intl.formatMessage({"id": "drawer.reports"})}
                                            onClick={this.handleClose}
                                        />
                                    </Link>

                                </MLMenuWrapper>

                            ) : null}

                            <MLMenuWrapper
                                userRoles={["administration_viewer"]}
                            >
                                <ListSubheader classes={{root: classes.label}}>
                                    {open ? this.props.intl.formatMessage({"id": "drawer.administration"}) : "\u00A0"}
                                </ListSubheader>

                                <Link
                                    to="/units"
                                    key="1"
                                >
                                    <MLMenuItem
                                        button
                                        className={classes.menuItem}
                                        userRoles={["metadata_viewer"]}
                                        icon={
                                            <MetadataIcon
                                                color="secondary"
                                                classes={{root: classes.label}}
                                            />}
                                        primary={this.props.intl.formatMessage({"id": "drawer.metadata"})}
                                        onClick={this.handleClose}
                                    />
                                </Link>

                                <Link
                                    to={"/templates"}
                                    key={"4"}
                                >
                                    <MLMenuItem
                                        button
                                        className={classes.menuItem}
                                        userRoles={["template_viewer"]}
                                        icon={
                                            <TemplateEditorIcon
                                                color="secondary"
                                                classes={{root: classes.label}}
                                            />}
                                        primary={this.props.intl.formatMessage({"id": "drawer.template.editor"})}
                                        onClick={this.handleClose}
                                    />
                                </Link>

                                <Link
                                    to={"/users"}
                                    key={"6"}
                                >
                                    <MLMenuItem
                                        button
                                        className={classes.menuItem}
                                        userRoles={["user_viewer"]}
                                        icon={
                                            <UserManagementIcon
                                                color="secondary"
                                                classes={{root: classes.label}}
                                            />}
                                        primary={this.props.intl.formatMessage({"id": "drawer.user.management"})}
                                        onClick={this.handleClose}
                                    />
                                </Link>

                            </MLMenuWrapper>
                        </List>

                    </div>

                    {open && (
                        <div
                            className={classes.secondaryLogo}
                            style={{background: "url(" + (secondaryLogo ? secondaryLogo : "/images/drawer/logo.png") + ") center center no-repeat"}}
                        />
                    )}

                </PerfectScrollbar>

            </Drawer>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        logo: state.login.logo,
        secondaryLogo: state.login.secondaryLogo,
        direction: state.login.direction,
        title: state.login.appTitle,
        project: state.units.unit
    };
};

export default injectIntl(connect(mapStateToProps)(withStyles(styles)(Navigation)));
