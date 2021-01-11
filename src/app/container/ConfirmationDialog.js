import ConfirmationDialog from "../component/widget/confirmationDialog/ConfirmationDialog";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { showNotification } from "../services/notification";

const mapStateToProps = ( state, ownProps) => {
    return {
        cancel : ownProps.cancel,
        confirm : ownProps.confirm,
        open : ownProps.open,
        title : ownProps.title,
        message : ownProps.message
    };
};

const mapDispatchToProps = ( dispatch ) => {
    return bindActionCreators({
        showNotification
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmationDialog);
