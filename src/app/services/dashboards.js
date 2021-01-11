import {beginLoading, endLoading} from "./loadingSpinner";
import {createErrorMessages, messagesReceived} from "./message";

import {TYPE_KEY} from "../common/constant";
import rest from "../common/rest";

const LOAD_DASHBOARD = "LOAD_DASHBOARD";
const UPDATE_DASHBOARD_ITEM_PROPERTIES = "UPDATE_DASHBOARD_ITEM_PROPERTIES";

export const DASHBOARD = "dashboard";
export const DASHBOARD_ID = "dashboardId";
export const DASHBOARD_ITEM_ID = "dashboardItemId";
export const DASHBOARD_ITEM_PROPERTIES = "dashboardItemProperties";

const initialState = {
    [DASHBOARD]: null,
    [DASHBOARD_ID]: null,
    [DASHBOARD_ITEM_ID]: null,
    [DASHBOARD_ITEM_PROPERTIES]: null
};

export default function reducer(state = initialState, action) {
    let newState;

    switch (action[TYPE_KEY]) {

        case LOAD_DASHBOARD:
            newState = {
                ...state,
                [DASHBOARD_ID]: action[DASHBOARD_ID],
                [DASHBOARD]: action[DASHBOARD]
            };
            break;

        case UPDATE_DASHBOARD_ITEM_PROPERTIES:
            newState = {
                ...state,
                [DASHBOARD_ID]: action[DASHBOARD_ID],
                [DASHBOARD_ITEM_ID]: action[DASHBOARD],
                [DASHBOARD_ITEM_PROPERTIES]: action[DASHBOARD_ITEM_PROPERTIES]
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

export function loadDashboard(dashboardId) {

    return (dispatch) => {
        dispatch(beginLoading());
        rest.doGet(`${window.de.mainlevel.BASE_URL_API}/dashboards/${dashboardId}`).then(json => {
            if (json) {
                dispatch(loadDashboardSuccessful(dashboardId, json));
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

export function updateDashboardItemProperties(dashboardId, itemId, properties) {

    return (dispatch) => {
        rest.doPut(`${window.de.mainlevel.BASE_URL_API}/dashboards/${dashboardId}/items/${itemId}/properties`, JSON.stringify(properties)).then(json => {
            if (json) {
                dispatch(updateDashboardItemPropertiesSuccessful(json));
            } else {
                dispatch(messagesReceived(createErrorMessages(json)));
            }
        }, reason => {
            dispatch(messagesReceived(createErrorMessages(reason)));
        });
    };
}

function loadDashboardSuccessful(dashboardId, dashboard) {
    return (dispatch) => {
        dispatch({
            [TYPE_KEY]: LOAD_DASHBOARD,
            [DASHBOARD_ID]: dashboardId,
            [DASHBOARD]: dashboard
        });
    };
}

function updateDashboardItemPropertiesSuccessful(dashboardId, itemId, properties) {

    return (dispatch) => {
        dispatch({
            [TYPE_KEY]: LOAD_DASHBOARD,
            [DASHBOARD_ID]: dashboardId,
            [DASHBOARD_ITEM_ID]: itemId,
            [DASHBOARD_ITEM_PROPERTIES]: properties
        });
    };
}
