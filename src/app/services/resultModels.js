import {beginLoading, endLoading} from "./loadingSpinner";
import {createErrorMessages, messagesReceived} from "./message";

import {TYPE_KEY} from "../common/constant";
import cloneDeep from "lodash/cloneDeep";
import filter from "lodash/filter";
import remove from "lodash/remove";
import rest from "../common/rest";
import {updateDashboardItemProperties} from "./dashboards";
import uuid from "uuid";

const LOAD_RESULT_MODEL_LIST_ACTION = "RESULT_MODELS.LOAD_RESULT_MODEL_LIST_ACTION";
const LOAD_RESULT_MODEL_ACTION = "RESULT_MODELS.LOAD_RESULT_MODEL_ACTION";
const CREATE_RESULT_MODEL_ACTION = "RESULT_MODELS.CREATE_RESULT_MODEL_ACTION";
const SAVE_RESULT_MODEL_ACTION = "RESULT_MODELS.SAVE_RESULT_MODEL_ACTION";
const ADD_RESULT_NODE_ACTION = "RESULT_MODELS.ADD_RESULT_NODE_ACTION";
const REMOVE_RESULT_NODE_ACTION = "RESULT_MODELS.ADD_RESULT_NODE_ACTION";

export const RESULT_MODEL_LIST = "resultModelList";
export const RESULT_MODEL = "resultModel";

const initialState = {
    [RESULT_MODEL]: null
};

export default function reducer(state = initialState, action) {
    let newState;
    switch (action[TYPE_KEY]) {

        case LOAD_RESULT_MODEL_LIST_ACTION:
            newState = {
                ...state,
                [RESULT_MODEL_LIST]: action[RESULT_MODEL_LIST]
            };
            break;

        case LOAD_RESULT_MODEL_ACTION:
            newState = {
                ...state,
                [RESULT_MODEL]: action[RESULT_MODEL]
            };
            break;

        case CREATE_RESULT_MODEL_ACTION:
            newState = {
                ...state,
                [RESULT_MODEL]: action[RESULT_MODEL]
            };
            break;

        case SAVE_RESULT_MODEL_ACTION: {
            newState = {
                ...state,
                [RESULT_MODEL]: action[RESULT_MODEL]
            };
            break;
        }

        case ADD_RESULT_NODE_ACTION: {
            newState = {
                ...state,
                [RESULT_MODEL]: action[RESULT_MODEL]
            };
            break;
        }

        case REMOVE_RESULT_NODE_ACTION: {
            newState = {
                ...state,
                [RESULT_MODEL]: action[RESULT_MODEL]
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

export function createResultModel(resultModel) {

    return (dispatch) => {
        rest.doPost(`${window.de.mainlevel.BASE_URL}/toc/resultmodels`, JSON.stringify(resultModel)).then(json => {
            if (json) {
                dispatch(createResultModelSuccessful(json));
                dispatch(loadResultModelList(resultModel.projectId));
            } else {
                dispatch(messagesReceived(createErrorMessages(json)));
            }
        }, reason => {
            dispatch(messagesReceived(createErrorMessages(reason)));
        });
    };
}

export function createResultModelAndUpdateDashboard(resultModel, dashboardId, dashboardItemId) {

    return (dispatch) => {
        rest.doPost(`${window.de.mainlevel.BASE_URL}/toc/resultmodels`, JSON.stringify(resultModel)).then(json => {
            if (json) {
                dispatch(createResultModelSuccessful(json));
                dispatch(updateDashboardItemProperties(dashboardId, dashboardItemId, {resultModelId: json.id}));
                dispatch(loadResultModelList());
            } else {
                dispatch(messagesReceived(createErrorMessages(json)));
            }
        }, reason => {
            dispatch(messagesReceived(createErrorMessages(reason)));
        });
    };
}

export function saveResultModel(resultModelId, resultModel) {

    return (dispatch) => {
        dispatch(beginLoading());
        rest.doPut(`${window.de.mainlevel.BASE_URL}/toc/resultmodels/${resultModelId}`, JSON.stringify(resultModel)).then(json => {
            if (json) {
                dispatch(saveResultModelSuccessful(json));
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

export function addResultNode(resultModel) {
    return (dispatch) => {

        let model = cloneDeep(resultModel);

        const node = {
            key: uuid.v4(),
            label: "New Result",
            description: "",
            level: model.levels.length > 0 ? model.levels[0].key : null,
            style: {
                top: "100px",
                left: "100px"
            }
        };

        model.results.push(node);

        dispatch(addResultNodeSuccessful(model));
    };
}

export function removeResultNode(resultModel, resultNode) {

    return (dispatch) => {

        const removedConnections = filter(resultModel.connections, function (connection) {
            return connection.source === resultNode.key || connection.target === resultNode.key;
        });

        remove(resultModel.results, resultNode);
        remove(resultModel.connections, removedConnections);

        dispatch(removeResultNodeSuccessful(resultModel));
    };
}

export function loadResultModelList(projectId) {

    return (dispatch) => {
        dispatch(beginLoading());
        rest.doGet(`${window.de.mainlevel.BASE_URL}/toc/resultmodels?projectId=${projectId}`).then(json => {
            if (json) {
                dispatch(loadResultModelListSuccessful(json.models));
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

export function loadResultModel(resultModelId) {

    return (dispatch) => {
        dispatch(beginLoading());
        rest.doGet(`${window.de.mainlevel.BASE_URL}/toc/resultmodels/${resultModelId}`).then(json => {
            if (json) {
                dispatch(loadResultModelSuccessful(json));
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

function createResultModelSuccessful(resultModel) {
    return {
        [TYPE_KEY]: CREATE_RESULT_MODEL_ACTION,
        [RESULT_MODEL]: resultModel
    };
}

function saveResultModelSuccessful(resultModel) {

    resultModel.refreshId = uuid.v4();

    return {
        [TYPE_KEY]: SAVE_RESULT_MODEL_ACTION,
        [RESULT_MODEL]: resultModel
    };
}

function loadResultModelListSuccessful(resultModelList) {
    return {
        [TYPE_KEY]: LOAD_RESULT_MODEL_LIST_ACTION,
        [RESULT_MODEL_LIST]: resultModelList
    };
}

function loadResultModelSuccessful(resultModel) {
    return {
        [TYPE_KEY]: LOAD_RESULT_MODEL_ACTION,
        [RESULT_MODEL]: resultModel
    };
}

function addResultNodeSuccessful(resultModel) {

    return {
        [TYPE_KEY]: ADD_RESULT_NODE_ACTION,
        [RESULT_MODEL]: resultModel
    };
}

function removeResultNodeSuccessful(resultModel) {

    return {
        [TYPE_KEY]: REMOVE_RESULT_NODE_ACTION,
        [RESULT_MODEL]: resultModel
    };
}
