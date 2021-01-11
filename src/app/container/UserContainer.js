import {IS_LOGGED_IN, logout} from "../services/login";
import {JWT_EXPIRED_HEARTBEAT, callJwtVerification} from "../services/user";

import User from "../component/public/user/User";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

const mapStateToProps = (state) => {
    return {
        [JWT_EXPIRED_HEARTBEAT]: state.user[JWT_EXPIRED_HEARTBEAT],
        [IS_LOGGED_IN]: state.login[IS_LOGGED_IN]
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        callJwtVerification,
        logout
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(User);
