import {
    UNIT_ROOT,
    deleteUnit,
    loadRootUnit,
    saveUnit
} from "../services/units";
import {
    UNIT_USER_LIST,
    USER_LIST,
    loadUserForUnit,
    loadUserListFilter,
    removeUserFromUnit,
    saveUsersForUnit
} from "../services/userlist";

import UnitTree from "../component/view/unitTree/UnitTree";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

const mapStateToProps = (state) => {
    return {
        [UNIT_ROOT]: state.units[UNIT_ROOT],
        [USER_LIST]: state.userList[USER_LIST],
        [UNIT_USER_LIST]: state.userList[UNIT_USER_LIST]
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        loadRootUnit,
        loadUserForUnit,
        loadUserListFilter,
        saveUnit,
        deleteUnit,
        removeUserFromUnit,
        saveUsersForUnit
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(UnitTree);
