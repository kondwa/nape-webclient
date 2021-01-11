import {beginLoading, endLoading} from "./loadingSpinner";
import {createErrorMessages, messagesReceived} from "./message";

import {TYPE_KEY} from "../common/constant";
import {defaultTheme} from "../common/theme";
import {loadUnit} from "./units";
import rest from "../common/rest";
import {showNotification} from "./notification";

const LOGIN_SUCCESSFUL_ACTION = "LOGIN_SUCCESSFUL";
const CHANGE_USERNAME = "CHANGE_USERNAME";
const CHANGE_PASSWORD = "CHANGE_PASSWORD";
const LOGIN_FAILED_ACTION = "LOGIN_FAILED_ACTION";
const SHOW_HIDE_PASSWORD_ACTION = "SHOW_HIDE_PASSWORD_ACTION";
const LOGIN_COOKIE_AVAILABLE = "LOGIN_COOKIE_AVAILABLE";
const LOGOUT = "LOGOUT";
const USER_RECEIVED = "USER_RECEIVED";
const ROLES_RECEIVED = "ROLES_RECEIVED";
const THEME_RECEIVED = "THEME_RECEIVED";
const DASHBOARDS_RECEIVED = "DASHBOARDS_RECEIVED";

export const COOKIE_LOGIN = "mlSolution";

export const IS_LOGGED_IN = "userIsLoggedIn";
export const USERNAME = "username";
export const PASSWORD = "password";
export const FIRST_NAME = "firstName";
export const LAST_NAME = "lastName";
export const LOGIN_FAILED = "loginFailed";
export const SHOW_PASSWORD = "showPassword";
export const TOKEN = "token";
export const ROLES = "roles";
export const THEME = "theme";
export const APP_TITLE = "appTitle";
export const LOGO = "logo";
export const SECONDARY_LOGO = "secondaryLogo";
export const DIRECTION = "direction";
export const DASHBOARD_IDS = "dashboardIds";

const initialState = {
    [IS_LOGGED_IN]: false,
    [USERNAME]: "",
    [FIRST_NAME]: "",
    [LAST_NAME]: "",
    [PASSWORD]: "",
    [LOGIN_FAILED]: false,
    [SHOW_PASSWORD]: false,
    [TOKEN]: "",
    [ROLES]: [],
    [THEME]: defaultTheme,
    [APP_TITLE]: "Mainlevel",
    [LOGO]: null,
    [SECONDARY_LOGO]: null,
    [DIRECTION]:""
};

export default function reducer(state = initialState, action) {

    let newState;

    switch (action[TYPE_KEY]) {

        case LOGIN_SUCCESSFUL_ACTION:
            newState = {
                ...state,
                [TOKEN]: action[TOKEN],
                [IS_LOGGED_IN]: true,
                [LOGIN_FAILED]: false
            };
            break;

        case LOGIN_FAILED_ACTION:
            newState = {
                ...initialState,
                [IS_LOGGED_IN]: false,
                [LOGIN_FAILED]: true
            };
            break;

        case USER_RECEIVED:
            newState = {
                ...state,
                [USERNAME]: action[USERNAME],
                [FIRST_NAME]: action[FIRST_NAME],
                [LAST_NAME]: action[LAST_NAME]
            };
            break;

        case ROLES_RECEIVED:
            newState = {
                ...state,
                [ROLES]: action[ROLES]
            };
            break;

        case THEME_RECEIVED:
            newState = {
                ...state,
                [APP_TITLE]: action[APP_TITLE],
                [LOGO]: action[LOGO],
                [SECONDARY_LOGO]: action[SECONDARY_LOGO],
                [THEME]: action[THEME],
                [DIRECTION]: action[DIRECTION]
            };
            break;

        case DASHBOARDS_RECEIVED:
            newState = {
                ...state,
                [DASHBOARD_IDS]: action[DASHBOARD_IDS]
            };
            break;


        case CHANGE_USERNAME:
            newState = {
                ...state,
                [USERNAME]: action[USERNAME]
            };
            break;

        case CHANGE_PASSWORD:
            newState = {
                ...state,
                [PASSWORD]: action[PASSWORD]
            };
            break;

        case SHOW_HIDE_PASSWORD_ACTION:
            newState = {
                ...state,
                [SHOW_PASSWORD]: action[SHOW_PASSWORD]
            };
            break;

        case LOGOUT: {
            newState = {
                ...initialState
            };
            break;
        }

        default:
            newState = {
                ...state
            };
            break;
    }

    return newState;
}

export function logout() {
    return {[TYPE_KEY]: LOGOUT};
}

export function checkCookieLogin(cookies) {

    const loginCookies = cookies.get(COOKIE_LOGIN);

    if (loginCookies) {
        return async (dispatch) => {
            dispatch(beginLoading());

            await dispatch(checkUserInfo(loginCookies));

            dispatch(endLoading());
        };
    }

    return {[TYPE_KEY]: LOGIN_COOKIE_AVAILABLE};
}

export function doLogin(cookies) {
    return async (dispatch, getState) => {
        try {
            const currentUser = await rest.doLogin(`${window.de.mainlevel.BASE_URL}/authentication/token`, getState().login[USERNAME], getState().login[PASSWORD]);
            const user = await rest.doGetWithToken(`${window.de.mainlevel.BASE_URL_API}/users/current`, currentUser.token);

            user.defaultProject && dispatch(loadUnit(user.defaultProject, currentUser.token));

            dispatch(themeReceived(user.theme));
            dispatch(dashboardsReceived(user.dashboards));
            dispatch(userReceived(user));

            let roles = user.roles.map(x => x.name);
            dispatch(rolesReceived(roles));

            cookies.set(COOKIE_LOGIN, {userName: currentUser.userName, token: currentUser.token});

            dispatch(loginSuccessful(currentUser));
            dispatch(showNotification("Login succeeded"));
        } catch (err) {
            dispatch(loginFail());
            dispatch(messagesReceived(createErrorMessages(err)));
            dispatch(showNotification("Login failed"));
        }
    };
}

export function checkUserInfo(loginCookies) {
    return async (dispatch, getState) => {

        const token = loginCookies && loginCookies.token ? loginCookies.token : getState().login.token;

        if (token) {
            try {
                const user = await rest.doGetWithToken(`${window.de.mainlevel.BASE_URL_API}/users/current`, token);

                user.defaultProject && dispatch(loadUnit(user.defaultProject, token));

                dispatch(themeReceived(user.theme));
                dispatch(dashboardsReceived(user.dashboards));
                dispatch(userReceived(user));

                let roles = user.roles.map(x => x.name);
                dispatch(rolesReceived(roles));

                dispatch(loginSuccessful(loginCookies));

            } catch (error) {
                dispatch(loginFail());
                dispatch(messagesReceived(createErrorMessages(`login.error.${error.status}`)));
                dispatch(showNotification("Session expired"));
            }

        } else {
            dispatch(loginFail());
            dispatch(showNotification("Session expired"));
        }
    };
}

export function changeUsername(newUsername = "") {
    return {
        [TYPE_KEY]: CHANGE_USERNAME,
        [USERNAME]: newUsername.trim()
    };
}

export function changePassword(newPassword = "") {
    return {
        [TYPE_KEY]: CHANGE_PASSWORD,
        [PASSWORD]: newPassword.trim()
    };
}

export function showHide(password) {
    return {
        [TYPE_KEY]: SHOW_HIDE_PASSWORD_ACTION,
        [SHOW_PASSWORD]: !password,
    };
}

function userReceived(user) {
    return {
        [TYPE_KEY]: USER_RECEIVED,
        [USERNAME]: user.username,
        [FIRST_NAME]: user.firstName,
        [LAST_NAME]: user.lastName
    };
}

function rolesReceived(roles) {
    return {
        [TYPE_KEY]: ROLES_RECEIVED,
        [ROLES]: roles
    };
}

function themeReceived(theme) {
    return {
        [TYPE_KEY]: THEME_RECEIVED,
        [APP_TITLE]: theme.applicationTitle,
        [LOGO]: theme.logo,
        [SECONDARY_LOGO]: theme.secondaryLogo,
        [THEME]: theme.styles
    };

}

function dashboardsReceived(dashboards) {
    return {
        [TYPE_KEY]: DASHBOARDS_RECEIVED,
        [DASHBOARD_IDS]: dashboards
    };

}

function loginSuccessful(currentUser) {
    return {
        [TYPE_KEY]: LOGIN_SUCCESSFUL_ACTION,
        [USERNAME]: currentUser.userName,
        [TOKEN]: currentUser.token
    };
}

function loginFail() {
    return {
        [TYPE_KEY]: LOGIN_FAILED_ACTION
    };
}
