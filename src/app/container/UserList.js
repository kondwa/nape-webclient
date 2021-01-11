import {
    USER_DIALOG_OPEN,
    USER_LIST,
    closeUserDialog,
    loadUserListFilter,
    openUserDialog
} from "../services/userlist";

import UserList from "../component/view/userList/UserList";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

const mapStateToProps = (state) => {
    return {
        [USER_LIST]: state.userList[USER_LIST],
        [USER_DIALOG_OPEN]: state.userList[USER_DIALOG_OPEN]
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        loadUserListFilter,
        openUserDialog,
        closeUserDialog
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(UserList);
