import {Component} from "react";
import ExtLinkDashboardItem from "./items/ExtLinkDashboardItem";
import Grid from "@material-ui/core/Grid";
import IndicatorDashboardItem from "./items/IndicatorDashboardItem";
import IndicatorListDashboardItem from "./items/IndicatorListDashboardItem";
import LatestSurveyCountSubmitDashboardItem from "./items/LatestSurveyCountSubmitDashboardItem";
import LatestSurveySubmitDashboardItem from "./items/LatestSurveySubmitDashboardItem";
import LinkDashboardItem from "./items/LinkDashboardItem";
import MLWrapper from "../../widget/wrapper/MLWrapper";
import Paper from "@material-ui/core/Paper";
import ProjectListDashboardItem from "./items/ProjectListDashboardItem";
import PropTypes from "prop-types";
import React from "react";
import ResultModelDashboardItem from "./items/ResultModelDashboardItem";
import SurveySubmitCountDashboardItem from "./items/SurveySubmitCountDashboardItem";
import WelcomeDashboardItem from "./items/WelcomeDashboardItem";
import {withRouter} from "react-router-dom";
import {withStyles} from "@material-ui/core/styles";

const styles = theme => ({
    root: {
        margin: "30px",
        flexGrow: 1,
        marginTop: theme.spacing.unit * 3,
    },
    paper: {
        padding: "16px"
    }
});

class Dashboard extends Component {

    static propTypes = {
        dashboard: PropTypes.object,
        project: PropTypes.object,
        classes: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {

        const {dashboard, classes, project} = this.props;

        return (

            <MLWrapper>

                {dashboard ? (

                    <div className={classes.root}>
                        <Grid
                            container
                            spacing={dashboard.spacing}
                        >

                            {dashboard.items && dashboard.items.map(item => (

                                <Grid
                                    item
                                    key={dashboard.key + "-" + item.key}
                                    xs={item.layout.xs ? item.layout.xs : undefined}
                                    sm={item.layout.sm ? item.layout.sm : undefined}
                                    md={item.layout.md ? item.layout.md : undefined}
                                    lg={item.layout.lg ? item.layout.lg : undefined}
                                    xl={item.layout.xl ? item.layout.xl : undefined}
                                >
                                    <Paper
                                        className={classes.paper}
                                        style={{height: item.height ? item.height : "100%"}}
                                    >

                                        {item.type === "LatestSurveySubmitDashboardItem" && (
                                            <LatestSurveySubmitDashboardItem
                                                dashboardKey={dashboard.key}
                                                dashbaordItemKey={item.key}
                                                {...item.properties}
                                            />
                                        )}

                                        {item.type === "LatestSurveyCountSubmitDashboardItem" && (
                                            <LatestSurveyCountSubmitDashboardItem
                                                dashboardKey={dashboard.key}
                                                dashbaordItemKey={item.key}
                                                {...item.properties}
                                            />
                                        )}

                                        {item.type === "SurveySubmitCountDashboardItem" && (
                                            <SurveySubmitCountDashboardItem
                                                dashboardKey={dashboard.key}
                                                dashbaordItemKey={item.key}
                                                {...item.properties}
                                            />
                                        )}

                                        {item.type === "IndicatorDashboardItem" && (
                                            <IndicatorDashboardItem
                                                dashboardKey={dashboard.key}
                                                dashbaordItemKey={item.key}
                                                {...item.properties}
                                            />
                                        )}

                                        {item.type === "IndicatorListDashboardItem" && (
                                            <IndicatorListDashboardItem
                                                dashboardKey={dashboard.key}
                                                dashbaordItemKey={item.key}
                                                project={project}
                                                {...item.properties}
                                            />
                                        )}

                                        {item.type === "ProjectListDashboardItem" && (
                                            <ProjectListDashboardItem
                                                dashboardKey={dashboard.key}
                                                dashbaordItemKey={item.key}
                                                {...item.properties}
                                            />
                                        )}

                                        {item.type === "WelcomeDashboardItem" && (
                                            <WelcomeDashboardItem
                                                dashboardKey={dashboard.key}
                                                dashbaordItemKey={item.key}
                                                {...item.properties}
                                            />
                                        )}

                                        {item.type === "ResultModelDashboardItem" && (
                                            <ResultModelDashboardItem
                                                dashboardKey={dashboard.key}
                                                dashbaordItemKey={item.key}
                                                project={project}
                                                {...item.properties}
                                            />
                                        )}

                                        {item.type === "LinkDashboardItem" && (
                                            <LinkDashboardItem
                                                dashboardKey={dashboard.key}
                                                dashbaordItemKey={item.key}
                                                project={project}
                                                {...item.properties}
                                            />
                                        )}

                                        {item.type === "ExtLinkDashboardItem" && (
                                            <ExtLinkDashboardItem
                                                dashboardKey={dashboard.key}
                                                dashbaordItemKey={item.key}
                                                project={project}
                                                {...item.properties}
                                            />
                                        )}

                                    </Paper>
                                </Grid>

                            ))}

                        </Grid>
                    </div>

                ) : null}

            </MLWrapper>
        );
    }

}

export default withRouter(withStyles(styles)(Dashboard));
