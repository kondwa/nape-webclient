import SurveyInvitationDialog from "../component/dialog/survey/SurveyInvitationDialog";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { createSurveyInstanceParticipant } from "../services/surveylist";
import { showNotification } from "../services/notification";

const mapStateToProps = ( state, ownProps) => {
    return {
        open : ownProps.open,
        closeDialog : ownProps.closeDialog,
        title : ownProps.title
    };
};

const mapDispatchToProps = ( dispatch ) => {
    return bindActionCreators({
        showNotification,
        createSurveyInstanceParticipant
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(SurveyInvitationDialog);
