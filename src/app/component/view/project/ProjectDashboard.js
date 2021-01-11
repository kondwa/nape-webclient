import {Component} from "react";
import Dashboard from "../../widget/dashboard/Dashboard";
import MLWrapper from "../../widget/wrapper/MLWrapper";
import PropTypes from "prop-types";
import React from "react";
import SectionTitle from "../../widget/sectionTitle/SectionTitle";
import Typography from "@material-ui/core/Typography";
import {injectIntl} from "react-intl";
import {withRouter} from "react-router-dom";
import {withStyles} from "@material-ui/core/styles";

const styles = () => ({
    altText: {
        margin: "50px"
    }
});

class ProjectDashboard extends Component {

    static propTypes = {
        project: PropTypes.object,
        loadProject: PropTypes.func,
        location: PropTypes.object,
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        const {loadProject} = this.props;

        let projectId = this.props.location.pathname.split("/")[2];
        loadProject && loadProject(projectId);
    }

    UNSAFE_componentWillReceiveProps(newProps) {

        const projectDashboard = newProps.project
        && newProps.project.dashboards
        && newProps.project.dashboards.length > 0
            ? newProps.project.dashboards[0]
            : undefined;

        const dashboard = newProps.dashboard ? newProps.dashboard.key : undefined;

        if (projectDashboard === dashboard) {
            this.setState({
                dashboard: newProps.dashboard
            });
        }
    }

    componentWillUnmount() {
        this.setState({dashboard: null});
    }

    render() {
        const {project, classes} = this.props;
        const {dashboard} = this.state;

        return (

            <MLWrapper>

                <div>
                    <div style={{marginTop: "30px"}}>
                        <SectionTitle name={project ? project.name : "Loading..."}/>
                    </div>

                    {dashboard ? (

                        <Dashboard dashboard={dashboard}/>

                    ) : (
                        <div>

                            {project ? (
                                <Typography
                                    className={classes.altText}
                                    variant="subtitle1"
                                >{"No dashboard defined for " + project.name}</Typography>

                            ) : (

                                <Typography
                                    className={classes.altText}
                                    variant="subtitle1"
                                >{"Loading..."}</Typography>

                            )}
                        </div>
                    )}

                </div>

            </MLWrapper>
        );
    }

}

export default injectIntl(withRouter(withStyles(styles, {withTheme: true})(ProjectDashboard)));
