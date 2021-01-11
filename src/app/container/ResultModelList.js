import {
    RESULT_MODEL_LIST,
    createResultModel,
    loadResultModelList
} from "../services/resultModels";

import ResultModelList from "../component/view/resultModel/ResultModelList";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

const mapStateToProps = (state) => {
    return {
        [RESULT_MODEL_LIST]: state.resultModels[RESULT_MODEL_LIST]
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        createResultModel,
        loadResultModelList
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ResultModelList);
