import {
    INDICATOR,
    loadIndicator,
    updateIndicator
} from "../services/resultIndicators";

import IndicatorDashboard from "../component/view/indicators/IndicatorDashboard";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

const mapStateToProps = (state) => {
    return {
        [INDICATOR]: state.resultIndicators[INDICATOR]
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({loadIndicator, updateIndicator}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(IndicatorDashboard);
