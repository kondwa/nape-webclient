import {createErrorMessages, messagesReceived} from "./message";

import {TYPE_KEY} from "../common/constant";
import rest from "../common/rest";

const LOAD_TEMPLATES_ACTION = "TEMPLATES.LOAD_TEMPLATES_ACTION";

export const TEMPLATE_LIST = "templateList";

const initialState = {
    [TEMPLATE_LIST]: null
};

export default function reducer(state = initialState, action) {
    let newState;
    switch (action[TYPE_KEY]) {
        case LOAD_TEMPLATES_ACTION:
            newState = {
                ...state,
                [TEMPLATE_LIST]: action[TEMPLATE_LIST]
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


export function loadTemplateListFilter() {
    return (dispatch) => {
        rest.doGet(`${window.de.mainlevel.BASE_URL_API}/templates/`).then(json => {
            if (json.surveys) {
                dispatch(loadSuccessful(json.surveys));
            } else {
                dispatch(messagesReceived(createErrorMessages(json)));
            }
        }, reason => {
            dispatch(messagesReceived(createErrorMessages(reason)));
        });
    };
}

export function loadSuccessful(list) {
    return {
        [TYPE_KEY]: LOAD_TEMPLATES_ACTION,
        [TEMPLATE_LIST]: list
    };
}
