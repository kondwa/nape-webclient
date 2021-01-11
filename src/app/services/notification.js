import { TYPE_KEY } from "../common/constant";

const DEFAULT_DURATION = 2000;

const OPEN_NOTIFICATION = "OPEN_NOTIFICATION";
const CLOSE_NOTIFICATION = "CLOSE_NOTIFICATION";
const SET_AUTO_HIDE_DURATION = "AUTO_HIDE_DURATION";
const SET_NOTIFICATION_MESSAGE = "SET_NOTIFICATION_MESSAGE";
const SET_ACTION_MESSAGE = "SET_ACTION_MESSAGE";
const SET_ACTION_TOUCH_TAP_CALLBACK = "SET_ACTION_TOUCH_TAP_CALLBACK";
const SET_REQUEST_CLOSE_CALLBACK = "SET_REQUEST_CLOSE_CALLBACK";

export const AUTO_HIDE_DURATION = "autoHideDuration";
export const ACTION_NODE = "actionNode";
export const MESSAGE_NODE = "messageNode";
export const OPEN = "open";
export const ACTION_TOUCH_TAP_CALLBACK = "actionTouchTapCallback";
export const REQUEST_CLOSE_CALLBACK = "requestCloseCallback";

export const initialState = {
    [OPEN]: false,
    [AUTO_HIDE_DURATION]: DEFAULT_DURATION,
    [ACTION_NODE]: "",
    [MESSAGE_NODE]: "",
    [ACTION_TOUCH_TAP_CALLBACK]: closeNotification,
    [REQUEST_CLOSE_CALLBACK]: closeNotification
};

export default function reducer( state = initialState, action ) {

    let newState;

    switch ( action[ TYPE_KEY ] ) {

        case OPEN_NOTIFICATION:
            newState = {
                ...state,
                [OPEN]: true
            };
            break;

        case CLOSE_NOTIFICATION:
            newState = {
                ...state,
                [OPEN]: false
            };
            break;

        case SET_NOTIFICATION_MESSAGE:
            newState = {
                ...state,
                [MESSAGE_NODE]: action[ MESSAGE_NODE ]
            };
            break;

        case SET_ACTION_MESSAGE:
            newState = {
                ...state,
                [ACTION_NODE]: action[ ACTION_NODE ]
            };
            break;

        case SET_ACTION_TOUCH_TAP_CALLBACK:
            newState = {
                ...state,
                [ACTION_TOUCH_TAP_CALLBACK]: action[ ACTION_TOUCH_TAP_CALLBACK ]
            };
            break;

        case SET_REQUEST_CLOSE_CALLBACK:
            newState = {
                ...state,
                [REQUEST_CLOSE_CALLBACK]: action[ REQUEST_CLOSE_CALLBACK ]
            };
            break;

        case SET_AUTO_HIDE_DURATION:
            newState = {
                ...state,
                [AUTO_HIDE_DURATION]: action[ AUTO_HIDE_DURATION ]
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

export function openNotification() {
    return {
        [TYPE_KEY]: OPEN_NOTIFICATION
    };
}

export function closeNotification() {
    return {
        [TYPE_KEY]: CLOSE_NOTIFICATION
    };
}

export function setAutoHideDuration( duration ) {
    return {
        [TYPE_KEY]: SET_AUTO_HIDE_DURATION,
        [AUTO_HIDE_DURATION]: duration
    };
}

export function setActionMessage( node ) {
    return {
        [TYPE_KEY]: SET_ACTION_MESSAGE,
        [ACTION_NODE]: node
    };
}

export function setNotificationMessage( node ) {
    return {
        [TYPE_KEY]: SET_NOTIFICATION_MESSAGE,
        [MESSAGE_NODE]: node
    };
}

export function setRequestCloseCallback( callback ) {
    return {
        [TYPE_KEY]: SET_REQUEST_CLOSE_CALLBACK,
        [REQUEST_CLOSE_CALLBACK]: callback
    };
}

export function requestCloseCallback() {
    return ( dispatch, getState ) => {
        dispatch(getState().notification[ REQUEST_CLOSE_CALLBACK ]());
    };
}

export function showNotification( messageNode = "", actionNode = "", requestCloseCallback = closeNotification, duration = DEFAULT_DURATION ) {

    return ( dispatch ) => {

        dispatch(setNotificationMessage(messageNode));
        dispatch(setActionMessage(actionNode));
        dispatch(setRequestCloseCallback(requestCloseCallback));
        dispatch(setAutoHideDuration(duration));
        dispatch(openNotification());

    };
}
