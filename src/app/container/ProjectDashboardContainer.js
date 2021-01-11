import {DASHBOARD, DASHBOARD_ID, loadDashboard} from "../services/dashboards";
import {UNIT, loadUnit} from "../services/units";

import ProjectDashboard from "../component/view/project/ProjectDashboard";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

const mapStateToProps = (state, ownProps) => {
    return {
        project: state.units[UNIT],
        [DASHBOARD]: state.dashboards[DASHBOARD],
        [DASHBOARD_ID]: ownProps.id
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        loadProject: loadUnit,
        loadDashboard
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectDashboard);
