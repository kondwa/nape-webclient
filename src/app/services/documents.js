import {beginLoading, endLoading} from "./loadingSpinner";
import {createErrorMessages, messagesReceived} from "./message";

import {TYPE_KEY} from "../common/constant";
import {document} from "../common/routes";
import history from "../common/history";
import rest from "../common/rest";

const LOAD_DOCUMENTS_ACTION = "DOCUMENT_LIST.LOAD_DOCUMENTS_ACTION";
const LOAD_DOCUMENT_ACTION = "DOCUMENT_LIST.LOAD_DOCUMENT_ACTION";
const CREATE_DOCUMENT_ACTION = "DOCUMENT_LIST.CREATE_DOCUMENT_ACTION";
const SAVE_DOCUMENT_ACTION = "DOCUMENT_LIST.SAVE_DOCUMENT_ACTION";
const LOAD_DOCUMENT_PLACEHOLDER_ACTION = "LOAD_DOCUMENT_PLACEHOLDER_ACTION";
const LOAD_DONORS_ACTION = "DOCUMENT_LIST.LOAD_DONORS_ACTION";
const LOAD_TEMPLATES_ACTION = "DOCUMENT_LIST.LOAD_TEMPLATES_ACTION";
const LOAD_TEMPLATE_ITEM_CONTENT_ACTION = "DOCUMENT_LIST.LOAD_TEMPLATE_ITEM_CONTENT_ACTION";
const SYNCHRONISE_TEMPLATES_ACTION = "DOCUMENT_LIST.SYNCHRONISE_TEMPLATES_ACTION";

export const DOCUMENT_LIST = "documentList";
export const DOCUMENT = "document";
export const DONOR_LIST = "donorList";
export const TEMPLATE_LIST = "templateList";
export const TEMPLATE_ITEM_CONTENT = "templateItemContent";

export const PLACEHOLDER_LIST = "placeholderList";


const initialState = {
    [DOCUMENT_LIST]: null,
    [DOCUMENT]: null,
    [DONOR_LIST]: null,
    [TEMPLATE_LIST]: null,
    [PLACEHOLDER_LIST]: null,
    [TEMPLATE_ITEM_CONTENT]: null
};

export default function reducer(state = initialState, action) {
    let newState;
    switch (action[TYPE_KEY]) {

        case LOAD_DOCUMENTS_ACTION:
            newState = {
                ...state,
                [DOCUMENT_LIST]: action[DOCUMENT_LIST]
            };
            break;

        case LOAD_DOCUMENT_ACTION:
            newState = {
                ...state,
                [DOCUMENT]: action[DOCUMENT]
            };
            break;

        case LOAD_DOCUMENT_PLACEHOLDER_ACTION:
            newState = {
                ...state,
                [PLACEHOLDER_LIST]: action[PLACEHOLDER_LIST]
            };
            break;

        case CREATE_DOCUMENT_ACTION:
            newState = {
                ...state,
                [DOCUMENT]: action[DOCUMENT]
            };
            break;

        case SAVE_DOCUMENT_ACTION:
            newState = {
                ...state,
                [DOCUMENT]: action[DOCUMENT]
            };
            break;

        case LOAD_DONORS_ACTION:
            newState = {
                ...state,
                [DONOR_LIST]: action[DONOR_LIST]
            };
            break;

        case LOAD_TEMPLATES_ACTION:
            newState = {
                ...state,
                [TEMPLATE_LIST]: action[TEMPLATE_LIST]
            };
            break;

        case LOAD_TEMPLATE_ITEM_CONTENT_ACTION:
            newState = {
                ...state,
                [TEMPLATE_ITEM_CONTENT]: action[TEMPLATE_ITEM_CONTENT]
            };
            break;

        case SYNCHRONISE_TEMPLATES_ACTION:
            newState = {
                ...state
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

export function loadTemplateList(language, type = "PROPOSAL") {
    return (dispatch) => {
        dispatch(beginLoading());
        rest.doGet(`${window.de.mainlevel.BASE_URL}/repit/templates?language=${language}&type=${type}`).then(json => {
            if (json.templates) {
                dispatch(loadTemplateListSuccessful(json.templates));
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

export function loadTemplateItemContent(templateId, itemKey) {
    return (dispatch) => {
        rest.doGet(`${window.de.mainlevel.BASE_URL}/repit/templates/${templateId}/items/${itemKey}`).then(json => {
            if (json.content) {
                dispatch(loadTemplateItemContentSuccessful(json.content));
            } else {
                dispatch(messagesReceived(createErrorMessages(json)));
            }
        }, reason => {
            dispatch(messagesReceived(createErrorMessages(reason)));
        });
    };

}

export function loadDonorList() {
    return (dispatch) => {
        dispatch(beginLoading());
        rest.doGet(`${window.de.mainlevel.BASE_URL}/repit/donors`).then(json => {
            if (json.donors) {
                dispatch(loadDonorListSuccessful(json.donors));
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

export function synchronizeTemplates() {
    return (dispatch) => {
        dispatch(beginLoading());
        rest.doPost(`${window.de.mainlevel.BASE_URL}/repit/templates/sync`).then(json => {
            if (json.reports) {
                dispatch(synchronizeTemplatesSuccessful());
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

export function loadDocumentListFilter(projectId) {
    return (dispatch) => {
        dispatch(beginLoading());
        rest.doGet(`${window.de.mainlevel.BASE_URL}/repit/reports?projectId=${projectId}`).then(json => {
            if (json.reports) {
                dispatch(loadDocumentListSuccessful(json.reports));
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

export function loadDocument(documentId) {
    return (dispatch) => {
        dispatch(beginLoading());
        rest.doGet(`${window.de.mainlevel.BASE_URL}/repit/reports/${documentId}`).then(json => {
            if (json) {
                dispatch(loadDocumentSuccessful(json));
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

export function loadDocumentPlaceholders(documentId) {
    return (dispatch) => {
        dispatch(beginLoading());
        rest.doGet(`${window.de.mainlevel.BASE_URL}/repit/reports/${documentId}/placeholders`).then(json => {
            if (json) {
                dispatch(loadDocumentPlaceholderListSuccessful(json.placeholders));
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

export function createDocument(doc) {

    return (dispatch) => {
        dispatch(beginLoading());
        rest.doPost(`${window.de.mainlevel.BASE_URL}/repit/reports`, JSON.stringify(doc)).then(json => {
            if (json) {
                dispatch(saveDocumentSuccessful(json));
                let route = document(json.id, doc.projectId);
                history.push(route);
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

export function saveDocument(documentId, document) {

    return (dispatch) => {
        dispatch(beginLoading());
        rest.doPut(`${window.de.mainlevel.BASE_URL}/repit/reports/${documentId}`, JSON.stringify(document)).then(json => {
            if (json) {
                dispatch(saveDocumentSuccessful(json));
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

export function generateDocument(documentId, document) {

    return (dispatch) => {
        dispatch(beginLoading());

        rest.doPut(`${window.de.mainlevel.BASE_URL}/repit/reports/${documentId}`, JSON.stringify(document)).then(json => {
            if (json) {

                try {
                    rest.doExport(`${window.de.mainlevel.BASE_URL}/repit/reports/${documentId}/export`, "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
                        .then(response => response.blob())
                        .then(blob => {

                            try {
                                let FileSaver = require("file-saver");

                                FileSaver.saveAs(blob, "report_" + documentId + ".docx");

                                dispatch(saveDocumentSuccessful(json));
                                dispatch(endLoading());
                            } catch (er) {
                                dispatch(endLoading());
                                dispatch(messagesReceived(createErrorMessages(er)));
                            }
                        });

                } catch (er) {
                    dispatch(endLoading());
                    dispatch(messagesReceived(createErrorMessages(er)));
                }

            } else {
                dispatch(endLoading());
                dispatch(messagesReceived(createErrorMessages(json)));
            }

        }, reason => {
            dispatch(endLoading());
            dispatch(messagesReceived(createErrorMessages(reason)));
        });
    };
}

function synchronizeTemplatesSuccessful() {
    return {[TYPE_KEY]: SYNCHRONISE_TEMPLATES_ACTION};
}

function loadTemplateListSuccessful(templates) {
    return {[TYPE_KEY]: LOAD_TEMPLATES_ACTION, [TEMPLATE_LIST]: templates};
}

function loadTemplateItemContentSuccessful(content) {
    return {[TYPE_KEY]: LOAD_TEMPLATE_ITEM_CONTENT_ACTION, [TEMPLATE_ITEM_CONTENT]: content};
}

function loadDonorListSuccessful(donors) {
    return {[TYPE_KEY]: LOAD_DONORS_ACTION, [DONOR_LIST]: donors};
}

function loadDocumentListSuccessful(documents) {
    return {[TYPE_KEY]: LOAD_DOCUMENTS_ACTION, [DOCUMENT_LIST]: documents};
}

function saveDocumentSuccessful(document) {
    return {[TYPE_KEY]: SAVE_DOCUMENT_ACTION, [DOCUMENT]: document};
}

function loadDocumentSuccessful(document) {
    return {[TYPE_KEY]: LOAD_DOCUMENT_ACTION, [DOCUMENT]: document};
}

function loadDocumentPlaceholderListSuccessful(placeholders) {
    return {[TYPE_KEY]: LOAD_DOCUMENT_PLACEHOLDER_ACTION, [PLACEHOLDER_LIST]: placeholders};
}
