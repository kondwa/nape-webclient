import {
    ORGANIZATIONS,
    SURVEY_DIALOG_OPEN,
    TEMPLATES,
    TEMPLATE_DATA_SOURCE,
    createSurvey,
    loadSurveyDialog
} from "../services/surveylist";

import SurveyDialog from "../component/dialog/survey/SurveyDialog";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

const mapStateToProps = (state, ownProps) => {
    return {
        closeDialog: ownProps.closeDialog,
        title: ownProps.title,
        projectKey: ownProps.projectKey,
        [SURVEY_DIALOG_OPEN]: state.surveyList[SURVEY_DIALOG_OPEN],
        [TEMPLATES]: state.surveyList[TEMPLATES],
        [TEMPLATE_DATA_SOURCE]: state.surveyList[TEMPLATE_DATA_SOURCE],
        [ORGANIZATIONS]: state.surveyList[ORGANIZATIONS],
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        createSurvey,
        loadSurveyDialog
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(SurveyDialog);
