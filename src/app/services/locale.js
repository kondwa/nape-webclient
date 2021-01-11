/*
 * Copyright (c) 2018 Mainlevel Consulting AG
 */
import {TYPE_KEY} from "../common/constant";
import messagesAr from "../common/i18n/messagesAr";
import messagesDe from "../common/i18n/messagesDe";
import messagesEn from "../common/i18n/messagesEn";
//import rest from "../common/rest";

export const LOCALE_CHANGE = "LOCALE.LOCALE_CHANGE";

export const MESSAGES_LOAD_REQUESTED = "MESSAGES_LOAD_REQUESTED";
export const MESSAGES_LOAD_SUCCEEDED = "MESSAGES_LOAD_SUCCEEDED";
export const MESSAGES_LOAD_FAILED = "MESSAGES_LOAD_FAILED";

export const LOCALE_LIST = "localeList";
export const LOCALE = "locale";
export const MESSAGES = "messages";
export const MESSAGES_LOADING = "messagesLoading";
export const ALL_MESSAGES = "allMessages";

const initialState = {
    [LOCALE_LIST]: ["en", "de", "ar"],
    [LOCALE]: "en",
    [MESSAGES_LOADING]: "LOADING"
};

export default function reducer(state = initialState, action) {
    let newState;
    switch (action[TYPE_KEY]) {

        case LOCALE_CHANGE:
            newState = {
                ...state,
                [LOCALE]: action[LOCALE],
                [MESSAGES]: action[MESSAGES]
            };
            break;

        case MESSAGES_LOAD_REQUESTED:
            newState = {
                ...state,
                [ALL_MESSAGES]: action[ALL_MESSAGES],
                [MESSAGES_LOADING]: "LOADING"
            };
            break;

        case MESSAGES_LOAD_SUCCEEDED:
            newState = {
                ...state,
                [ALL_MESSAGES]: action[ALL_MESSAGES],
                [MESSAGES_LOADING]: "SUCCESS"
            };
            break;

        case MESSAGES_LOAD_FAILED:
            newState = {
                ...state,
                [ALL_MESSAGES]: action[ALL_MESSAGES],
                [MESSAGES_LOADING]: "FAILED"
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

export function changeLocale(locale) {

    return (dispatch, getState) => {

        const allMessages = getState().locale[ALL_MESSAGES];

        dispatch({
            [TYPE_KEY]: LOCALE_CHANGE,
            [LOCALE]: locale,
            [MESSAGES]: allMessages[locale]
        });
    };
}

export function loadMessages(locale) {
    return (dispatch) => {
        dispatch(loadMessagesRequested());

        try {
            dispatch(loadMessagesSucceeded({
                en: messagesEn,
                de: messagesDe,
                ar: messagesAr
            }));
            dispatch(changeLocale(locale));
        } catch (e) {
            dispatch(loadMessagesFailed(e));
        }

    };
}

function loadMessagesRequested() {
    return {
        [TYPE_KEY]: MESSAGES_LOAD_REQUESTED
    };
}

function loadMessagesSucceeded(payload) {
    return {
        [TYPE_KEY]: MESSAGES_LOAD_SUCCEEDED,
        [ALL_MESSAGES]: payload
    };
}

function loadMessagesFailed() {
    return {
        [TYPE_KEY]: MESSAGES_LOAD_FAILED
    };
}
