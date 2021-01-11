export const isLoggedIn = state => {
    return !!(state.login.userIsLoggedIn && !state.login.loginFailed);
};
