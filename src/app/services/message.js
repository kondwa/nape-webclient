import {TYPE_KEY} from "../common/constant";

const MESSAGES_RECEIVED_ACTION = "MESSAGE_MESSAGES_RECEIVED_ACTION";
const CLEAR_MESSAGES_ACTION = "MESSAGE_CLEAR_MESSAGES_ACTION";
const CLEAR_MESSAGE_ACTION = "MESSAGE_CLEAR_MESSAGE_ACTION";

export const MESSAGE_KEY = "message";
export const MESSAGES_KEY = "messages";
export const INDEX_KEY = "index";

const SEVERITY_KEY = "severity";

const initialState = {
    [MESSAGES_KEY]: []
};

export default function reducer(state = initialState, action) {
    let newState;

    switch (action[TYPE_KEY]) {

        case MESSAGES_RECEIVED_ACTION:
            newState = Object.assign({}, state, {
                [MESSAGES_KEY]: action[MESSAGES_KEY]
            });
            break;

        case CLEAR_MESSAGES_ACTION:
            newState = Object.assign({}, state, {
                [MESSAGES_KEY]: []
            });
            break;

        case CLEAR_MESSAGE_ACTION:
            newState = Object.assign({}, state, {
                [MESSAGES_KEY]: state[MESSAGES_KEY].filter((message, index) => index !== action[INDEX_KEY])
            });
            break;

        default:
            newState = Object.assign({}, state, {});
            break;
    }
    return newState;
}

//actions
function _createMessages(message, severity) {
    const messageType = typeof(message);

    if (messageType === "string") {
        return [{
            [MESSAGE_KEY]: message,
            [SEVERITY_KEY]: severity
        }];
    }
    message[SEVERITY_KEY] = severity;
    return [message];
}

export function createErrorMessages(message) {
    return _createMessages(message, "error");
}

export function createWarningMessages(message) {
    return _createMessages(message, "warning");
}

export function createInfoMessages(message) {
    return _createMessages(message, "info");
}

export function createSuccessMessages(message) {
    return _createMessages(message, "success");
}

export function messagesReceived(messages) {
    return {
        [TYPE_KEY]: MESSAGES_RECEIVED_ACTION,
        [MESSAGES_KEY]: messages
    };
}

export function clearMessages() {
    return {
        [TYPE_KEY]: CLEAR_MESSAGES_ACTION
    };
}

export function clearMessage(index) {
    return {
        [TYPE_KEY]: CLEAR_MESSAGE_ACTION,
        [INDEX_KEY]: index
    };
}
