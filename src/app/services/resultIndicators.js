import {beginLoading, endLoading} from "./loadingSpinner";
import {createErrorMessages, messagesReceived} from "./message";

import {TYPE_KEY} from "../common/constant";
import cloneDeep from "lodash/cloneDeep";
import findIndex from "lodash/findIndex";
import rest from "../common/rest";

const LOAD_INDICATORS_ACTION = "RESULT_INDICATORS.LOAD_INDICATORS";
const ADD_INDICATOR_ACTION = "RESULT_INDICATORS.ADD_INDICATOR";
const REMOVE_INDICATOR_ACTION = "RESULT_INDICATORS.REMOVE_INDICATOR";
const LOAD_INDICATOR_LIST_ACTION = "RESULT_MODELS.LOAD_INDICATOR_LIST";
const LOAD_INDICATOR_ACTION = "RESULT_INDICATORS.LOAD_INDICATOR";
const UPDATE_INDICATOR_ACTION = "RESULT_INDICATORS.UPDATE_INDICATOR";

export const INDICATOR_LIST = "indicatorList";
export const INDICATORS = "indicators";
export const INDICATOR = "indicator";

const initialState = {
    [INDICATOR_LIST]: null,
    [INDICATORS]: null,
    [INDICATOR]: null
};

export default function reducer(state = initialState, action) {
    let newState;
    switch (action[TYPE_KEY]) {

        case ADD_INDICATOR_ACTION: {
            newState = {
                ...state,
                [INDICATORS]: action[INDICATORS]
            };
            break;
        }

        case LOAD_INDICATORS_ACTION: {
            newState = {
                ...state,
                [INDICATORS]: action[INDICATORS]
            };
            break;
        }

        case REMOVE_INDICATOR_ACTION: {
            newState = {
                ...state,
                [INDICATORS]: action[INDICATORS]
            };
            break;
        }

        case LOAD_INDICATOR_LIST_ACTION: {
            newState = {
                ...state,
                [INDICATOR_LIST]: action[INDICATOR_LIST]
            };
            break;
        }

        case LOAD_INDICATOR_ACTION: {
            newState = {
                ...state,
                [INDICATOR]: action[INDICATOR]
            };
            break;
        }

        case UPDATE_INDICATOR_ACTION: {
            newState = {
                ...state,
                [INDICATOR]: action[INDICATOR],
                [INDICATORS]: action[INDICATORS],
                [INDICATOR_LIST]: action[INDICATORS]
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

export function loadIndicators(result) {
    return (dispatch) => {
        dispatch(loadIndicatorsSuccessful(result.indicators));
    };
}

export function addIndicator(resultModelId, result, indicator) {

    return (dispatch) => {
        rest.doPost(`${window.de.mainlevel.BASE_URL}/toc/resultmodels/${resultModelId}/indicators`, JSON.stringify(indicator)).then(json => {
            if (json) {
                dispatch(addIndicatorSuccessful(result, json));
            } else {
                dispatch(messagesReceived(createErrorMessages(json)));
            }
        }, reason => {
            dispatch(messagesReceived(createErrorMessages(reason)));
        });
    };
}

export function removeIndicator(result, index) {
    return (dispatch) => {
        dispatch(removeIndicatorsSuccessful(result.indicators, index));
    };
}

export function loadIndicatorList(resultModelId) {

    return (dispatch) => {
        dispatch(beginLoading());
        rest.doGet(`${window.de.mainlevel.BASE_URL}/toc/resultmodels/${resultModelId}/indicators`).then(json => {
            if (json) {
                dispatch(loadIndicatorListSuccessful(json.indicators));
            } else {
                dispatch(messagesReceived(createErrorMessages(json)));
            }
            dispatch(endLoading());
        }, reason => {
            dispatch(endLoading());
            dispatch(messagesReceived(createErrorMessages(reason)));
        });
    };

}

export function loadIndicator(indicatorId) {

    return (dispatch) => {
        dispatch(beginLoading());
        rest.doGet(`${window.de.mainlevel.BASE_URL}/toc/indicators/${indicatorId}`).then(json => {
            if (json) {
                dispatch(loadIndicatorSuccessful(json));
            } else {
                dispatch(messagesReceived(createErrorMessages(json)));
            }
            dispatch(endLoading());
        }, reason => {
            dispatch(endLoading());
            dispatch(messagesReceived(createErrorMessages(reason)));
        });
    };
}

export function updateIndicator(indicatorId, indicator, indicatorList) {

    return (dispatch) => {
        dispatch(beginLoading());
        rest.doPut(`${window.de.mainlevel.BASE_URL}/toc/indicators/${indicatorId}`, JSON.stringify(indicator)).then(json => {
            if (json) {
                dispatch(updateIndicatorSuccessful(json, indicatorList));
            } else {
                dispatch(messagesReceived(createErrorMessages(json)));
            }
            dispatch(endLoading());
        }, reason => {
            dispatch(endLoading());
            dispatch(messagesReceived(createErrorMessages(reason)));
        });
    };
}

function loadIndicatorSuccessful(indicator) {

    return {
        [TYPE_KEY]: LOAD_INDICATOR_ACTION,
        [INDICATOR]: indicator
    };
}

function updateIndicatorSuccessful(indicator, indicatorList) {

    const indicators = indicatorList ? cloneDeep(indicatorList) : [];
    const index = findIndex(indicatorList, {id: indicator.id});

    if (index !== -1) {
        indicators.splice(index, 1, indicator);
    }

    return {
        [TYPE_KEY]: UPDATE_INDICATOR_ACTION,
        [INDICATOR]: indicator,
        [INDICATORS]: indicators
    };
}

function loadIndicatorsSuccessful(indicators) {

    let newIndicators = indicators ? cloneDeep(indicators) : [];

    return {
        [TYPE_KEY]: LOAD_INDICATORS_ACTION,
        [INDICATORS]: newIndicators
    };
}

function addIndicatorSuccessful(result, indicator) {

    let indicators = result.indicators ? cloneDeep(result.indicators) : [];
    indicators.push(indicator);

    return {
        [TYPE_KEY]: ADD_INDICATOR_ACTION,
        [INDICATORS]: indicators
    };
}

function removeIndicatorsSuccessful(indicators, index) {

    let newIndicators = indicators ? cloneDeep(indicators) : [];

    if (newIndicators.length > index) {
        newIndicators.splice(index, 1);
    }

    return {
        [TYPE_KEY]: REMOVE_INDICATOR_ACTION,
        [INDICATORS]: newIndicators
    };
}

function loadIndicatorListSuccessful(indicatorList) {
    return {
        [TYPE_KEY]: LOAD_INDICATOR_LIST_ACTION,
        [INDICATOR_LIST]: indicatorList
    };
}
