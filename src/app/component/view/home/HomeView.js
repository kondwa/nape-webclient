import {injectIntl, intlShape} from "react-intl";

import {Component} from "react";
import Dashboard from "../../widget/dashboard/Dashboard";
import MLWrapper from "../../widget/wrapper/MLWrapper";
import PropTypes from "prop-types";
import React from "react";
import SectionTitle from "../../widget/sectionTitle/SectionTitle";
import {withRouter} from "react-router-dom";
import {withStyles} from "@material-ui/core/styles";

const styles = () => ({
    wrapper: {
        marginTop: "30px"
    }
});

class HomeView extends Component {

    static propTypes = {
        dashboardIds: PropTypes.array,
        dashboard: PropTypes.object,
        loadDashboard: PropTypes.func,
        intl: intlShape.isRequired,
        classes: PropTypes.object,
        project: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        const {dashboardIds, loadDashboard} = this.props;

        if (dashboardIds && dashboardIds.length > 0) {
            loadDashboard(dashboardIds[0].id);
        }
    }

    render() {

        const {dashboard, classes, project} = this.props;

        return (

            <MLWrapper>

                <div>
                    <div className={classes.wrapper}>
                        {project ? <SectionTitle name={project.name}/>
                            : <SectionTitle name={this.props.intl.formatMessage({"id": "home.title"})}/>}
                    </div>

                    {dashboard ? (

                        <Dashboard
                            dashboard={dashboard}
                            project={project}
                        />

                    ) : null}

                </div>

            </MLWrapper>
        );
    }

}

export default injectIntl(withRouter(withStyles(styles, {withTheme: true})(HomeView)));
