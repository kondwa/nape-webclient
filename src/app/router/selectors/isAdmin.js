import * as constant from "../../common/constant";

export const isAdmin = state => {
    return state.login && state.login.user && state.login.user.role === constant.ROLE_ADMIN;
};
