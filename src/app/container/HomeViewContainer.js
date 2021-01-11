import {DASHBOARD, loadDashboard} from "../services/dashboards";

import {DASHBOARD_IDS} from "../services/login";
import HomeView from "../component/view/home/HomeView";
import {UNIT} from "../services/units";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

const mapStateToProps = (state) => {
    return {
        [DASHBOARD]: state.dashboards[DASHBOARD],
        [DASHBOARD_IDS]: state.login[DASHBOARD_IDS],
        project: state.units[UNIT]
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        loadDashboard
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeView);
