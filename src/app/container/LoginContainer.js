import {
    IS_LOGGED_IN,
    LOGIN_FAILED,
    PASSWORD,
    SHOW_PASSWORD,
    USERNAME,
    changePassword,
    changeUsername,
    checkCookieLogin,
    doLogin,
    showHide,
} from "../services/login";

import Login from "../component/public/login/Login";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

const mapStateToProps = ( state ) => {
    return {
        [IS_LOGGED_IN]: state.login[ IS_LOGGED_IN ],
        [LOGIN_FAILED]: state.login[ LOGIN_FAILED ],
        [USERNAME]: state.login[ USERNAME ],
        [PASSWORD]: state.login[ PASSWORD ],
        [SHOW_PASSWORD]: state.login[ SHOW_PASSWORD ]
    };
};

const mapDispatchToProps = ( dispatch ) => {
    return bindActionCreators({
        doLogin,
        changeUsername,
        changePassword,
        showHide,
        checkCookieLogin
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
