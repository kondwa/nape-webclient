import {
    ACTION_NODE,
    AUTO_HIDE_DURATION,
    MESSAGE_NODE,
    OPEN,
    requestCloseCallback
} from "../services/notification";

import Notification from "../component/widget/notification/Notification";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

const mapStateToProps = ( state ) => {
    return {
        [OPEN]: state.notification[ OPEN ],
        [AUTO_HIDE_DURATION]: state.notification[ AUTO_HIDE_DURATION ],
        [MESSAGE_NODE]: state.notification[ MESSAGE_NODE ],
        [ACTION_NODE]: state.notification[ ACTION_NODE ],
    };
};

const mapDispatchToProps = ( dispatch ) => {
    return bindActionCreators({
        requestCloseCallback
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Notification);
