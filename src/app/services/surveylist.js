import {beginLoading, endLoading} from "./loadingSpinner";
import {createErrorMessages, messagesReceived} from "./message";

import {TYPE_KEY} from "../common/constant";
import history from "../common/history";
import {loadSuccessful} from "./surveyRunner";
import rest from "../common/rest";
import {showNotification} from "./notification";

const LOAD_SURVEY_ACTION = "SURVEY_LIST.LOAD_SURVEY_ACTION";
const LOAD_SURVEYS_ACTION = "SURVEY_LIST.LOAD_SURVEYS_ACTION";
const LOAD_SURVEY_INSTANCES_ACTION = "SURVEY_LIST.LOAD_SURVEY_INSTANCES_ACTION";
const LOAD_SURVEY_INSTANCE_LIST_SIZE_ACTION = "SURVEY_LIST.LOAD_SURVEY_INSTANCE_LIST_SIZE_ACTION";
const OPEN_SURVEY_DIALOG_ACTION = "SURVEY_LIST.OPEN_SURVEY_DIALOG_ACTION";
const CLOSE_SURVEY_DIALOG_ACTION = "SURVEY_LIST.CLOSE_SURVEY_DIALOG_ACTION";
const OPEN_SURVEY_INSTANCE_INVITATION_DIALOG_ACTION = "SURVEY_LIST.OPEN_SURVEY_INSTANCE_INVITATION_DIALOG_ACTION";
const CLOSE_SURVEY_INSTANCE_INVITATION_DIALOG_ACTION = "SURVEY_LIST.CLOSE_SURVEY_INSTANCE_INVITATION_DIALOG_ACTION";
const CREATE_SURVEY_INSTANCE_ACTION = "SURVEY_LIST.CREATE_SURVEY_INSTANCE_ACTION";
const DELETE_SURVEY_INSTANCE_ACTION = "SURVEY_LIST.DELETE_SURVEY_INSTANCE_ACTION";

const SURVEY_DIALOG = "SURVEY_LIST.SURVEY_DIALOG";

export const SURVEY = "survey";
export const SURVEY_GID = "surveyGid";
export const SURVEY_LIST = "surveyList";
export const SURVEY_INSTANCE = "surveyInstance";
export const SURVEY_INSTANCE_LIST = "surveyInstanceList";
export const SURVEY_INSTANCE_LIST_SIZE = "surveyInstanceListSize";
export const SURVEY_INSTANCE_GID = "surveyInstanceGid";
export const SURVEY_DIALOG_OPEN = "loadSurveyDialogOpen";
export const SURVEY_INSTANCE_INVITATION_DIALOG_OPEN = "invitationDialogOpen";

export const TEMPLATES = "templates";
export const TEMPLATE_DATA_SOURCE = "templateDataSource";
export const ORGANIZATIONS = "organizations";

const initialState = {
    [SURVEY]: null,
    [SURVEY_LIST]: null,
    [SURVEY_INSTANCE]: null,
    [SURVEY_INSTANCE_LIST]: null,
    [SURVEY_INSTANCE_LIST_SIZE]: [],
    [SURVEY_INSTANCE_GID]: null,
    [SURVEY_DIALOG_OPEN]: false,
    [SURVEY_INSTANCE_INVITATION_DIALOG_OPEN]: false,
    [TEMPLATES]: [],
    [TEMPLATE_DATA_SOURCE]: [],
    [ORGANIZATIONS]: []
};

export default function reducer(state = initialState, action) {
    let newState;
    switch (action[TYPE_KEY]) {

        case LOAD_SURVEYS_ACTION:
            newState = {
                ...state,
                [SURVEY_LIST]: action[SURVEY_LIST]
            };
            break;

        case OPEN_SURVEY_DIALOG_ACTION:
            newState = {
                ...state,
                [SURVEY_DIALOG_OPEN]: true
            };
            break;

        case CLOSE_SURVEY_DIALOG_ACTION:
            newState = {
                ...state,
                [SURVEY_DIALOG_OPEN]: false
            };
            break;

        case OPEN_SURVEY_INSTANCE_INVITATION_DIALOG_ACTION:
            newState = {
                ...state,
                [SURVEY_INSTANCE_INVITATION_DIALOG_OPEN]: true
            };
            break;

        case CLOSE_SURVEY_INSTANCE_INVITATION_DIALOG_ACTION:
            newState = {
                ...state,
                [SURVEY_INSTANCE_INVITATION_DIALOG_OPEN]: false
            };
            break;

        case LOAD_SURVEY_INSTANCES_ACTION:
            newState = {
                ...state,
                [SURVEY_INSTANCE_LIST]: action[SURVEY_INSTANCE_LIST]
            };
            break;

        case LOAD_SURVEY_INSTANCE_LIST_SIZE_ACTION:
            newState = {
                ...state,
                [SURVEY_INSTANCE_LIST_SIZE]: state[SURVEY_INSTANCE_LIST_SIZE].concat({
                    [SURVEY_GID]: action[SURVEY_GID],
                    [SURVEY_INSTANCE_LIST_SIZE]: action[SURVEY_INSTANCE_LIST_SIZE]
                })
            };

            break;

        case LOAD_SURVEY_ACTION:
            newState = {
                ...state,
                [SURVEY]: action[SURVEY]
            };
            break;

        case CREATE_SURVEY_INSTANCE_ACTION:
            newState = {
                ...state,
                [SURVEY_INSTANCE]: action[SURVEY_INSTANCE]
            };
            break;

        case SURVEY_DIALOG:
            newState = {
                ...state,
                [TEMPLATES]: action[TEMPLATES],
                [TEMPLATE_DATA_SOURCE]: action[TEMPLATE_DATA_SOURCE],
                [ORGANIZATIONS]: action[ORGANIZATIONS]
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

export function loadSurveyListFilter(projectKey) {
    return (dispatch) => {
        let url = `${window.de.mainlevel.BASE_URL_API}/surveys/stats/`;
        if (projectKey) {
            url += `?unitKey=${projectKey}`;
        }

        rest.doGet(url).then(json => {
            if (json.surveys) {
                dispatch(loadSurveyListSuccessful(json.surveys));
            } else {
                dispatch(messagesReceived(createErrorMessages(json)));
            }
        }, reason => {
            dispatch(messagesReceived(createErrorMessages(reason)));
        });
    };
}

export function loadSurvey(surveyGid) {
    return (dispatch) => {
        rest.doGet(`${window.de.mainlevel.BASE_URL_API}/v2/surveys/${surveyGid}`).then(json => {
            if (json) {
                dispatch(loadSurveySuccessful(json));
            } else {
                dispatch(messagesReceived(createErrorMessages(json)));
            }
        }, reason => {
            dispatch(messagesReceived(createErrorMessages(reason)));
        });
    };
}

export function loadSurveyInstanceListFilter(surveyGid) {
    return (dispatch) => {
        dispatch(beginLoading());
        rest.doGet(`${window.de.mainlevel.BASE_URL_API}/surveys/${surveyGid}/instances/`).then(json => {
            if (json.surveys) {
                dispatch(loadSurveyInstanceListSuccessful(json.surveys));
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

export function loadSurveyInstanceSize(surveyGid) {
    return (dispatch) => {
        rest.doGet(`${window.de.mainlevel.BASE_URL_API}/surveys/${surveyGid}/instances/size`).then(json => {
            if (typeof(json) !== undefined) {
                dispatch(loadSurveyInstanceSizeSuccessful(surveyGid, json));
            } else {
                dispatch(messagesReceived(createErrorMessages(json)));
            }
        }, reason => {
            dispatch(messagesReceived(createErrorMessages(reason)));
        });
    };
}

export function createSurveyInstance(surveyGid, payload) {
    return (dispatch) => {
        rest.doPost(`${window.de.mainlevel.BASE_URL_API}/surveys/${surveyGid}/instances/`, JSON.stringify(payload)).then(json => {
            if (json) {
                dispatch(loadSuccessful(json));
                history.push("/surveyRunner");
                //dispatch(createInstanceSuccessful(json.surveyInstance));
                //dispatch(loadSurveyInstanceListFilter(surveyGid));

            } else {
                dispatch(messagesReceived(createErrorMessages(json)));
            }
        }, reason => {
            dispatch(messagesReceived(createErrorMessages(reason)));
        });
    };
}

export function archiveSurveyInstance(surveyGid, surveyInstanceGid) {
    return (dispatch) => {
        rest.doDelete(`${window.de.mainlevel.BASE_URL_API}/surveys/${surveyGid}/instances/${surveyInstanceGid}`).then(json => {
            if (json) {
                dispatch(deleteInstanceSuccessful(surveyInstanceGid));
                dispatch(loadSurveyInstanceListFilter(surveyGid));
                dispatch(showNotification("Survey Instance successfully archived."));
            } else {
                dispatch(messagesReceived(createErrorMessages(json)));
            }
        }, reason => {
            dispatch(messagesReceived(createErrorMessages(reason)));
        });
    };
}

export function changeSurveyInstanceStatus(surveyGid, surveyInstanceGid, status) {
    return (dispatch) => {
        rest.doPut(`${window.de.mainlevel.BASE_URL_API}/surveys/${surveyGid}/instances/${surveyInstanceGid}/${status}`).then(json => {
            if (json) {
                dispatch(loadSurveyInstanceListFilter(surveyGid));
                dispatch(showNotification("Survey Instance Status successfully change."));
            } else {
                dispatch(messagesReceived(createErrorMessages(json)));
            }
        }, reason => {
            dispatch(messagesReceived(createErrorMessages(reason)));
        });
    };
}

export function createSurveyInstanceParticipant(surveyGid, payload) {
    return (dispatch) => {
        rest.doPost(`${window.de.mainlevel.BASE_URL_API}/surveys/${surveyGid}/participants/`, JSON.stringify(payload)).then(json => {
            if (json) {
                dispatch(closeInvitationDialog());
                dispatch(createInstanceSuccessful(json.surveyInstance));
                dispatch(loadSurveyInstanceListFilter(surveyGid));
            } else {
                dispatch(messagesReceived(createErrorMessages(json)));
            }
        }, reason => {
            dispatch(messagesReceived(createErrorMessages(reason)));
        });
    };
}

export function loadSurveyDialog() {
    let templateDataSource = [];
    let organizationDataSource = [];

    return async (dispatch) => {
        try {
            dispatch(beginLoading());
            const template = await rest.doGet(`${window.de.mainlevel.BASE_URL_API}/templates/`);
            const organization = await rest.doGet(`${window.de.mainlevel.BASE_URL_API}/units/root`);

            template.surveys.forEach((survey) => {
                templateDataSource.push({
                    textKey: survey.surveyName,
                    valueKey: survey.identifier
                });
            });

            organization.children.forEach((organization) => {
                organizationDataSource.push({
                    textKey: organization.name,
                    valueKey: organization.id
                });

            });

            const data = Object.assign({}, initialState, {
                templates: template.surveys,
                templateDataSource: templateDataSource,
                organizationDataSource: organizationDataSource,
                organizations: organization.children
            });

            await dispatch(loadDialog(data));
            dispatch(endLoading());
        } catch (er) {
            dispatch(endLoading());
            dispatch(messagesReceived(createErrorMessages(er)));
        }
    };
}

export function createSurvey(payload) {
    return (dispatch) => {
        dispatch(beginLoading());

        rest.doPost(`${window.de.mainlevel.BASE_URL_API}/v2/surveys/`, JSON.stringify(payload)).then(() => {
            dispatch(showNotification("activation.form.creation.successful"));
            dispatch(loadSurveyListFilter());
            dispatch(closeSurveyDialog());
            dispatch(endLoading());
        }, reason => {
            dispatch(endLoading());
            dispatch(showNotification("activation.form.creation.error.request"));
            throw new Error(reason);
        });
    };
}

export function handleExport(surveyGid) {
    return (dispatch) => {
        dispatch(beginLoading());
        rest.doGet(`${window.de.mainlevel.BASE_URL_API}/surveys/${surveyGid}/report/summary?DELIMITER=comma`, "text/csv").then(response => {
            let FileSaver = require("file-saver");
            let blob = new Blob(response.response.split(), {type: "text/csv;charset=utf-8"});

            FileSaver.saveAs(blob, "export_" + surveyGid + ".csv");
            dispatch(endLoading());
        });
    };
}

export function loadSurveySuccessful(survey) {
    return {[TYPE_KEY]: LOAD_SURVEY_ACTION, [SURVEY]: survey};
}

export function loadSurveyListSuccessful(list) {
    return {[TYPE_KEY]: LOAD_SURVEYS_ACTION, [SURVEY_LIST]: list};
}

export function loadSurveyInstanceListSuccessful(list) {
    return {[TYPE_KEY]: LOAD_SURVEY_INSTANCES_ACTION, [SURVEY_INSTANCE_LIST]: list};
}

export function loadSurveyInstanceSizeSuccessful(surveyGid, size) {
    return {
        [TYPE_KEY]: LOAD_SURVEY_INSTANCE_LIST_SIZE_ACTION,
        [SURVEY_GID]: surveyGid,
        [SURVEY_INSTANCE_LIST_SIZE]: size
    };
}

export function createInstanceSuccessful(surveyInstance) {
    return {[TYPE_KEY]: CREATE_SURVEY_INSTANCE_ACTION, [SURVEY_INSTANCE]: surveyInstance};
}

export function deleteInstanceSuccessful(surveyInstanceId) {
    return {[TYPE_KEY]: DELETE_SURVEY_INSTANCE_ACTION, [SURVEY_INSTANCE_GID]: surveyInstanceId};
}


export function openSurveyDialog() {
    return {[TYPE_KEY]: OPEN_SURVEY_DIALOG_ACTION};
}

export function closeSurveyDialog() {
    return {[TYPE_KEY]: CLOSE_SURVEY_DIALOG_ACTION};
}

export function openInvitationDialog() {
    return {[TYPE_KEY]: OPEN_SURVEY_INSTANCE_INVITATION_DIALOG_ACTION};
}

export function closeInvitationDialog() {
    return {[TYPE_KEY]: CLOSE_SURVEY_INSTANCE_INVITATION_DIALOG_ACTION};
}

export function loadDialog(data) {
    return {
        [TYPE_KEY]: SURVEY_DIALOG,
        [TEMPLATES]: data.templates,
        [TEMPLATE_DATA_SOURCE]: data.templateDataSource,
        [ORGANIZATIONS]: data.organizations
    };
}
