import {beginLoading, endLoading} from "./loadingSpinner";
import {createErrorMessages, messagesReceived} from "./message";

import {TYPE_KEY} from "../common/constant";
import _ from "lodash";
import {loadDashboard} from "./dashboards";
import rest from "../common/rest";

const LOAD_UNIT_ROOT_ACTION = "UNITS.LOAD_UNIT_ROOT_ACTION";
const LOAD_PROJECT_LIST_ACTION = "UNITS.LOAD_PROJECT_LIST_ACTION";
const LOAD_UNIT_ACTION = "UNITS.LOAD_UNIT_ACTION";
const SAVE_UNIT_ACTION = "UNITS.SAVE_UNIT_ACTION";
const DELETE_UNIT_ACTION = "UNITS.SAVE_UNIT_ACTION";

export const UNIT_ROOT = "root";
export const OLD_UNIT = "oldUnit";
export const NEW_UNIT = "newUnit";
export const PROJECT_LIST = "projectList";
export const UNIT = "unit";

const initialState = {
    [UNIT_ROOT]: null,
    [UNIT]: null,
    [OLD_UNIT]: null,
    [NEW_UNIT]: null,
    [PROJECT_LIST]: null
};

export default function reducer(state = initialState, action) {
    let newState;
    switch (action[TYPE_KEY]) {

        case LOAD_UNIT_ROOT_ACTION:
            newState = {
                ...state,
                [UNIT_ROOT]: action[UNIT_ROOT]
            };
            break;

        case LOAD_UNIT_ACTION:
            newState = {
                ...state,
                [UNIT]: action[UNIT]
            };
            break;

        case SAVE_UNIT_ACTION: {

            let root = replaceUnitInTree(action[OLD_UNIT], action[NEW_UNIT], state[UNIT_ROOT]);

            newState = {
                ...state,
                [OLD_UNIT]: action[OLD_UNIT],
                [NEW_UNIT]: action[NEW_UNIT],
                [UNIT_ROOT]: root
            };
            break;
        }

        case LOAD_PROJECT_LIST_ACTION: {
            newState = {
                ...state,
                [PROJECT_LIST]: action[PROJECT_LIST]
            };
            break;
        }

        case DELETE_UNIT_ACTION:
            newState = {
                ...state,
                [OLD_UNIT]: action[OLD_UNIT],
                [NEW_UNIT]: action[NEW_UNIT],
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

export function loadRootUnit() {
    return (dispatch) => {
        dispatch(beginLoading());
        rest.doGet(`${window.de.mainlevel.BASE_URL_API}/units/root`).then(json => {
            if (json) {
                dispatch(loadSuccessful(json));
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

export function saveUnit(unit) {
    return (dispatch) => {
        dispatch(beginLoading());
        rest.doPut(`${window.de.mainlevel.BASE_URL_API}/units/${unit.foreignId}`, JSON.stringify(unit)).then(json => {
            if (json) {
                dispatch(saveUnitSuccessful(unit, json));
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

export function deleteUnit(unit) {
    return (dispatch) => {
        dispatch(beginLoading());
        rest.doDelete(`${window.de.mainlevel.BASE_URL_API}/units/${unit.foreignId}`).then(json => {
            if (json) {
                dispatch(deleteUnitSuccessful(json));
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

export function loadProjectList() {
    return (dispatch) => {
        dispatch(beginLoading());
        rest.doGet(`${window.de.mainlevel.BASE_URL_API}/units/root`).then(json => {
            if (json) {
                dispatch(loadProjectsRootSuccessful(json));
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

export function loadUnit(unitKey, token) {
    return (dispatch) => {
        dispatch(beginLoading());
        rest.doGetWithToken(`${window.de.mainlevel.BASE_URL_API}/units/${unitKey}`, token).then(json => {
            if (json) {
                dispatch(loadUnitSuccessful(json));

                if (json.dashboards && json.dashboards.length > 0) {
                    dispatch(loadDashboard(json.dashboards[0]));
                }
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

function replaceUnitInTree(oldUnit, newUnit, root) {
    let parent = findParent(root, oldUnit);

    if (parent) {
        let i;
        for (i = 0; i < parent.children.length && parent.children[i].foreignId !== oldUnit.foreignId; i++) {
            // Nothing
        }
        i < parent.children.length ? parent.children[i] = newUnit : parent.children.push(newUnit);
    }

    return {...root};
}

function findParent(parent, unit) {
    let found = _.find(parent.children, unit);

    if (found) {
        return parent;
    } else {
        if (parent.children) {
            for (let i = 0; i < parent.children.length; i++) {
                let newParent = findParent(parent.children[i], unit);
                if (newParent) {
                    return newParent;
                }
            }
        }
        return null;
    }
}

function findUnits(parent, type) {
    let units = [];

    if (parent.type === type) {
        units.push(parent);
    }

    if (parent.children) {
        for (let i = 0; i < parent.children.length; i++) {
            let children = findUnits(parent.children[i], type);

            for (let j = 0; j < children.length; j++) {
                if (!children[j].parentName) {
                    children[j].parentName = parent.name;
                }
                units.push(children[j]);
            }
        }
    }
    return units;
}

function loadProjectsRootSuccessful(root) {

    let projects = findUnits(root, "Project");

    return {
        [TYPE_KEY]: LOAD_PROJECT_LIST_ACTION,
        [PROJECT_LIST]: projects
    };
}

function loadUnitSuccessful(unit) {
    return {
        [TYPE_KEY]: LOAD_UNIT_ACTION,
        [UNIT]: unit
    };
}

function saveUnitSuccessful(oldUnit, newUnit) {
    return {
        [TYPE_KEY]: SAVE_UNIT_ACTION,
        [NEW_UNIT]: newUnit,
        [OLD_UNIT]: oldUnit
    };
}

function deleteUnitSuccessful(unit) {
    return {
        [TYPE_KEY]: DELETE_UNIT_ACTION,
        [NEW_UNIT]: null,
        [OLD_UNIT]: unit
    };
}

function loadSuccessful(root) {
    return {
        [TYPE_KEY]: LOAD_UNIT_ROOT_ACTION,
        [UNIT_ROOT]: root
    };
}
