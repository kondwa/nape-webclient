import {
    QUESTIONS,
    SURVEY_INSTANCE,
    activateTriggers,
    addQuestionAnswer,
    loadSurveyInstance,
    loadSurveyInstanceAnonymous,
    propertyChange,
    removeQuestionAnswer,
    saveAndSubmitSurveyInstanceAnonymous,
    saveSurveyInstance,
    submitSurveyInstance
} from "../services/surveyRunner";
import SurveyRunner from "../component/view/surveyRunner/SurveyRunner";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {scrollTo} from "../services/layout";

const mapStateToProps = (state) => {
    return {
        [SURVEY_INSTANCE]: state.surveyRunner[SURVEY_INSTANCE],
        [QUESTIONS]: state.surveyRunner[QUESTIONS],
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        addQuestionAnswer,
        activateTriggers,
        loadSurveyInstance,
        loadSurveyInstanceAnonymous,
        removeQuestionAnswer,
        propertyChange,
        saveAndSubmitSurveyInstanceAnonymous,
        saveSurveyInstance,
        submitSurveyInstance,
        scrollTo,
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(SurveyRunner);
