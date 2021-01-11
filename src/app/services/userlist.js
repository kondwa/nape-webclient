import {beginLoading, endLoading} from "./loadingSpinner";
import {createErrorMessages, messagesReceived} from "./message";

import {TYPE_KEY} from "../common/constant";
import rest from "../common/rest";

const LOAD_USERS_ACTION = "USERS.LOAD_USERS_ACTION";
const LOAD_UNIT_USERS_ACTION = "USERS.LOAD_UNIT_USERS_ACTION";
const SAVE_UNIT_USERS_ACTION = "USERS.SAVE_UNIT_USERS_ACTION";
const DELETE_UNIT_USERS_ACTION = "USERS.DELETE_UNIT_USERS_ACTION";
const USER_DIALOG_OPEN_ACTION = "USERS.USER_DIALOG_OPEN_ACTION";
const USER_DIALOG_CLOSE_ACTION = "USERS.USER_DIALOG_CLOSE_ACTION";

export const USER_LIST = "userList";
export const UNIT_USER_LIST = "unitUserList";
export const USER_DIALOG_OPEN = "userDialogOpen";

const initialState = {
    [USER_LIST]: null,
    [UNIT_USER_LIST]: null,
    [USER_DIALOG_OPEN]: false
};

export default function reducer(state = initialState, action) {
    let newState;
    switch (action[TYPE_KEY]) {

        case LOAD_USERS_ACTION:
            newState = {
                ...state,
                [USER_LIST]: action[USER_LIST]
            };
            break;

        case LOAD_UNIT_USERS_ACTION:
            newState = {
                ...state,
                [UNIT_USER_LIST]: action[UNIT_USER_LIST]
            };
            break;

        case SAVE_UNIT_USERS_ACTION:
            newState = {
                ...state,
                [UNIT_USER_LIST]: action[UNIT_USER_LIST]
            };
            break;

        case DELETE_UNIT_USERS_ACTION:
            newState = {
                ...state
            };
            break;

        case USER_DIALOG_OPEN_ACTION:
            newState = {
                ...state,
                [USER_DIALOG_OPEN]: true
            };
            break;

        case USER_DIALOG_CLOSE_ACTION:
            newState = {
                ...state,
                [USER_DIALOG_OPEN]: false
            };
            break;

        default:
            newState = {
                ...state
            };
            break;
    }
    return newState;
}


export function loadUserListFilter() {
    return async (dispatch) => {
        dispatch(beginLoading());
        try {
            const userList = await rest.doGet(`${window.de.mainlevel.BASE_URL}/authentication/users/`);
            await dispatch(loadUsersSuccessful(userList.users));
            dispatch(endLoading());
        } catch (error) {
            dispatch(endLoading());
            dispatch(messagesReceived(createErrorMessages(error)));
        }
    };
}

export function loadUserForUnit(unitKey) {
    return (dispatch) => {

        if (unitKey) {

            rest.doGet(`${window.de.mainlevel.BASE_URL_API}/units/${unitKey}/users`).then(json => {
                if (json.users) {
                    dispatch(loadUnitUsersSuccessful(json.users));
                } else {
                    dispatch(messagesReceived(createErrorMessages(json)));
                }
            }, reason => {
                dispatch(messagesReceived(createErrorMessages(reason)));
            });

        } else {
            dispatch(loadUnitUsersSuccessful([]));
        }
    };
}

export function saveUsersForUnit(unitKey, users) {
    return (dispatch) => {
        rest.doPost(`${window.de.mainlevel.BASE_URL_API}/units/${unitKey}/users`, JSON.stringify({users: users})).then(json => {
            if (json.users) {
                dispatch(saveUnitUsersSuccessful(json.users));
                dispatch(loadUserForUnit(unitKey));
            } else {
                dispatch(messagesReceived(createErrorMessages(json)));
            }
        }, reason => {
            dispatch(messagesReceived(createErrorMessages(reason)));
        });
    };
}

export function removeUserFromUnit(unitKey, userGid, username) {
    return (dispatch) => {
        rest.doDelete(`${window.de.mainlevel.BASE_URL_API}/units/${unitKey}/users/${userGid}?username=${username}`).then(json => {
            if (json) {
                dispatch(deleteUnitUsersSuccessful());
                dispatch(loadUserForUnit(unitKey));
            } else {
                dispatch(messagesReceived(createErrorMessages(json)));
            }
        }, reason => {
            dispatch(messagesReceived(createErrorMessages(reason)));
        });
    };
}

export function loadUsersSuccessful(list) {
    return {
        [TYPE_KEY]: LOAD_USERS_ACTION,
        [USER_LIST]: list
    };
}

export function loadUnitUsersSuccessful(list) {
    return {
        [TYPE_KEY]: LOAD_UNIT_USERS_ACTION,
        [UNIT_USER_LIST]: list
    };
}

export function saveUnitUsersSuccessful(list) {
    return {
        [TYPE_KEY]: SAVE_UNIT_USERS_ACTION,
        [UNIT_USER_LIST]: list
    };
}

export function deleteUnitUsersSuccessful() {
    return {
        [TYPE_KEY]: DELETE_UNIT_USERS_ACTION
    };
}

export function openUserDialog() {
    return {
        [TYPE_KEY]: USER_DIALOG_OPEN_ACTION
    };
}

export function closeUserDialog() {
    return {
        [TYPE_KEY]: USER_DIALOG_CLOSE_ACTION
    };
}
