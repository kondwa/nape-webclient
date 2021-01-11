import {
    SURVEY_DIALOG_OPEN,
    SURVEY_LIST,
    closeSurveyDialog,
    loadSurveyListFilter,
    openSurveyDialog
} from "../services/surveylist";

import SurveyList from "../component/view/surveyList/SurveyList";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

const mapStateToProps = ( state ) => {
    return {
        [SURVEY_LIST]: state.surveyList[ SURVEY_LIST ],
        [SURVEY_DIALOG_OPEN]: state.surveyList[ SURVEY_DIALOG_OPEN ]
    };
};

const mapDispatchToProps = ( dispatch ) => {
    return bindActionCreators({
        loadSurveyListFilter,
        openSurveyDialog,
        closeSurveyDialog
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(SurveyList);
