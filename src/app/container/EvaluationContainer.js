import {
    RESULT_MODEL,
    loadResultModel,
    saveResultModel
} from "../services/resultModels";

import Evaluation from "../component/view/evaluation/Evaluation";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

const mapStateToProps = (state) => {
    return {
        [RESULT_MODEL]: state.resultModels[RESULT_MODEL]
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        loadResultModel,
        saveResultModel,
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Evaluation);
