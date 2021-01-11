import {beginLoading, endLoading} from "./loadingSpinner";

import {TYPE_KEY} from "../common/constant";
import forOwn from "lodash/forOwn";
import head from "lodash/head";
import rest from "../common/rest";

const LOAD_INDICATOR_GROUPS = "LOAD_INDICATOR_GROUPS";
const LOAD_INDICATORS = "LOAD_INDICATORS";
const LOAD_INDICATOR = "LOAD_INDICATOR";
export const INDICATOR_GROUPS = "indicatorGroups";
export const INDICATOR_GROUP_ID = "id";
export const INDICATORS = "indicators";
export const INDICATOR = "indicator";
export const INDICATOR_KEY = "key";

const initialState = {
    [INDICATOR_GROUPS]: null,
    [INDICATORS]: null,
    [INDICATOR]: null
};

export default function reducer(state = initialState, action) {
    let newState;
    switch (action[TYPE_KEY]) {
        case LOAD_INDICATOR_GROUPS:
            newState = {
                ...state,
                [INDICATOR_GROUPS]: action[INDICATOR_GROUPS]
            };
            break;
        case LOAD_INDICATORS:
            newState = {
                ...state,
                [INDICATORS]: action[INDICATORS],
                [INDICATOR_GROUP_ID]: action[INDICATOR_GROUP_ID]
            };
            break;
        case LOAD_INDICATOR:
            newState = {
                ...state,
                [INDICATOR]: {
                    [INDICATOR]: action[INDICATOR],
                    [INDICATOR_KEY]: action[INDICATOR_KEY]
                }
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

export function loadIndicatorGroups() {
    return async (dispatch) => {
        dispatch(beginLoading());
        try {
            // Load group
            const json = await rest.doGet(`${window.de.mainlevel.BASE_URL_API}/indicatorGroups/`);
            // Find first in group
            const firstGroup = head(json.groups).id;

            // Update state with group
            await dispatch(indicatorGroupsLoadedSuccessful(json));
            // Update state with indicators
            await dispatch(loadIndicators(firstGroup, false));
            dispatch(endLoading());
        } catch (error) {
            dispatch(endLoading());
            throw new Error(error);
        }
    };
}

export function loadIndicators(groupId, filterParams, loading = true) {
    return async (dispatch) => {
        if (loading) {
            dispatch(beginLoading());
        }
        try {
            let params = "";

            if (filterParams) {
                forOwn(filterParams, function (value, key) {
                    if (key) {
                        params = params.length === 0 ? "?" : params.concat("&");
                        params = params.concat(key + "=" + (value ? value : ""));
                    }
                });
            }

            const group = await rest.doGet(`${window.de.mainlevel.BASE_URL_API}/indicatorGroups/${groupId}/indicators` + params);
            await dispatch(indicatorsLoadedSuccessful(group, groupId));
            dispatch(endLoading());
        }
        catch (error) {
            dispatch(endLoading());
            throw new Error(error);
        }
    };
}

export function loadIndicator(groupId, indicatorKey, loading = true) {
    return async (dispatch) => {
        if (loading) {
            dispatch(beginLoading());
        }
        try {
            const indicator = await rest.doGet(`${window.de.mainlevel.BASE_URL_API}/indicatorGroups/${groupId}/indicators/${indicatorKey}`);
            await dispatch(indicatorLoadedSuccessful(indicator, indicatorKey));
            dispatch(endLoading());
        }
        catch (error) {
            dispatch(endLoading());
            throw new Error(error);
        }
    };
}

function indicatorGroupsLoadedSuccessful(json) {
    return {
        [TYPE_KEY]: LOAD_INDICATOR_GROUPS,
        [INDICATOR_GROUPS]: json.groups
    };
}

function indicatorsLoadedSuccessful(group, id) {
    return (dispatch) => {
        dispatch({
            [TYPE_KEY]: LOAD_INDICATORS,
            [INDICATOR_GROUP_ID]: id,
            [INDICATORS]: group.indicators
        });
    };
}

function indicatorLoadedSuccessful(indicator, key) {
    return (dispatch) => {
        dispatch({
            [TYPE_KEY]: LOAD_INDICATOR,
            [INDICATOR_KEY]: key,
            [INDICATOR]: indicator
        });
    };
}
