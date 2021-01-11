import {
    INDICATORS,
    INDICATOR_GROUPS,
    loadIndicatorGroups,
    loadIndicators
} from "../services/indicators";

import Indicators from "../component/view/indicators/Indicators";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

const mapStateToProps = (state) => {
    return {
        [INDICATOR_GROUPS]: state.indicators[INDICATOR_GROUPS],
        [INDICATORS]: state.indicators[INDICATORS]
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({loadIndicators, loadIndicatorGroups}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Indicators);
