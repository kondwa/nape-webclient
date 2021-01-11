/*
 * Copyright (c) 2018 Mainlevel Consulting AG
 */
import {TYPE_KEY} from "../common/constant";
import moment from "moment";

const ERROR_RECEIVED = "ERROR_RECEIVED";
const ERROR_SELECTED = "ERROR_SELECTED";

const ERROR = "error";
const ERRORS = "errors";
const SELECTED_ERROR = "selectedError";

const initialState = {
    [ERRORS]: [],
    [SELECTED_ERROR]: undefined
};

export default function reducer(state = initialState, action) {
    let newState;

    switch (action[TYPE_KEY]) {

        case ERROR_RECEIVED:
            newState = {
                ...state,
                [ERRORS]: [action[ERROR], ...state[ERRORS]],
                [SELECTED_ERROR]: {...action[ERROR]}
            };
            break;

        case ERROR_SELECTED:
            newState = {
                ...state,
                [SELECTED_ERROR]: action[ERROR]
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

export function errorSelected(index) {

    return (dispatch, getState) => {

        const state = getState().error;

        dispatch({
            [TYPE_KEY]: ERROR_SELECTED,
            [ERROR]: state.errors[index]
        });
    };
}

export function errorReceived(error) {
    return {
        [TYPE_KEY]: ERROR_RECEIVED,
        [ERROR]: {
            ...error,
            message: error.message,
            date: moment()
        }
    };
}
