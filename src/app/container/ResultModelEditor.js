import {
    RESULT_MODEL,
    addResultNode,
    loadResultModel,
    removeResultNode,
    saveResultModel
} from "../services/resultModels";

import ResultModelEditor from "../component/view/resultModel/ResultModelEditor";
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
        addResultNode,
        removeResultNode
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ResultModelEditor);
