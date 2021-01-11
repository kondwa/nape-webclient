/*
 * Copyright (c) 2018 Mainlevel Consulting AG
 */
import * as ROUTES from "../../../common/routes";
import {Link, Switch, withRouter} from "react-router-dom";
import React, {PureComponent} from "react";
import AuthRoute from "../../../router/AuthRoute";
import Button from "@material-ui/core/Button";
import DataCollection from "../../../container/DataCollectionList";
import DocumentGenerator from "../../../container/DocumentGenerator";
import DocumentList from "../../../container/DocumentList";
import ErrorViewContainer from "../../../container/ErrorViewContainer";
import EvaluationContainer from "../../../container/EvaluationContainer";
import HomeViewContainer from "../../../container/HomeViewContainer";
import IndicatorDashboardContainer from "../../../container/IndicatorDashboardContainer";
import Indicators from "../../../container/Indicators";
import LoadingSpinnerContainer from "../../../container/LoadingSpinnerContainer";
import ProjectDashboardContainer from "../../../container/ProjectDashboardContainer";
import ProjectListContainer from "../../../container/ProjectListContainer";
import PropTypes from "prop-types";
import ResultModelEditor from "../../../container/ResultModelEditor";
import ResultModelList from "../../../container/ResultModelList";
import SurveyInstanceList from "../../../container/SurveyInstanceList";
import SurveyList from "../../../container/SurveyList";
import SurveyRunner from "../../../container/SurveyRunner";
import TemplateList from "../../../container/TemplateList";
import UnitTree from "../../../container/UnitTree";
import UserContainer from "../../../container/UserContainer";
import UserList from "../../../container/UserList";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {errorReceived} from "../../../services/error";
import {showNotification} from "../../../services/notification";
import {withStyles} from "@material-ui/core/styles/index";

const styles = (theme) => ({
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit * 3,
    }
});

class Main extends PureComponent {

    static propTypes = {
        errorReceived: PropTypes.func,
        showNotification: PropTypes.func,
        history: PropTypes.object,
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    componentDidCatch(error, info) {

        const errorReport = {
            name: error ? error.name : info.value,
            message: error ? error.message : info.componentStack,
            stack: error ? error.stack : info.componentStack
        };

        this.props.errorReceived(errorReport);

        this.props.showNotification(
            <div>
                <p>
                    {"An error occurred: " + errorReport.name}
                </p>

                <Link to={ROUTES.ERRORS}>
                    <Button
                        variant={"outlined"}
                        color={"secondary"}
                    >
                        {"Show Details"}
                    </Button>
                </Link>
            </div>);

        this.props.history.push("/");
    }

    render() {
        const {classes} = this.props;

        return (
            <main className={classes.content}>

                <UserContainer/>

                <LoadingSpinnerContainer/>

                <Switch>

                    <AuthRoute
                        exact
                        path={ROUTES.DASHBOARD}
                        component={HomeViewContainer}
                    />

                    <AuthRoute
                        exact
                        path={ROUTES.TEMPLATES}
                        component={TemplateList}
                    />

                    <AuthRoute
                        exact
                        path={ROUTES.DOCUMENT_LIST}
                        component={DocumentList}
                    />

                    <AuthRoute
                        exact
                        path={ROUTES.ERRORS}
                        component={ErrorViewContainer}
                    />

                    <AuthRoute
                        exact
                        path={ROUTES.PROJECT_LIST}
                        component={ProjectListContainer}
                    />

                    <AuthRoute
                        exact
                        path={ROUTES.PROJECT_DASHBOARD}
                        component={ProjectDashboardContainer}
                    />

                    <AuthRoute
                        exact
                        path={ROUTES.RESULT_MODEL_LIST}
                        component={ResultModelList}
                    />

                    <AuthRoute
                        exact
                        path={ROUTES.RESULT_MODEL}
                        component={ResultModelEditor}
                    />

                    <AuthRoute
                        exact
                        path={ROUTES.INDICATOR}
                        component={IndicatorDashboardContainer}
                    />

                    <AuthRoute
                        exact
                        path={ROUTES.EVALUATION}
                        component={EvaluationContainer}
                    />

                    <AuthRoute
                        exact
                        path={ROUTES.DOCUMENT}
                        component={DocumentGenerator}
                    />

                    <AuthRoute
                        exact
                        path={ROUTES.SURVEY_LIST}
                        component={SurveyList}
                    />

                    <AuthRoute
                        exact
                        path={ROUTES.SURVEY_INSTANCE_LIST}
                        component={SurveyInstanceList}
                    />

                    <AuthRoute
                        exact
                        path={ROUTES.SURVEY_RUNNER}
                        component={SurveyRunner}
                    />

                    <AuthRoute
                        exact
                        path={ROUTES.INDICATORS}
                        component={Indicators}
                    />

                    <AuthRoute
                        exact
                        path={ROUTES.DATA_COLLECTION}
                        component={DataCollection}
                    />

                    <AuthRoute
                        exact
                        path={ROUTES.USERS}
                        component={UserList}
                    />

                    <AuthRoute
                        exact
                        path={ROUTES.UNITS}
                        component={UnitTree}
                    />

                    <AuthRoute
                        component={HomeViewContainer}
                    />

                </Switch>
            </main>
        );
    }
}

const mapStateToProps = () => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({errorReceived, showNotification}, dispatch);
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Main)));

