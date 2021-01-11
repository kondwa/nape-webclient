import { applyMiddleware, combineReducers, createStore } from "redux";

import dashboards from "../services/dashboards";
import documents from "../services/documents";
import error from "../services/error";
import indicators from "../services/indicators";
import layout from "../services/layout";
import loading from "../services/loadingSpinner";
import locale from "../services/locale";
import login from "../services/login";
import message from "../services/message";
import notification from "../services/notification";
import resultIndicators from "../services/resultIndicators";
import resultModels from "../services/resultModels";
import surveyList from "../services/surveylist";
import surveyRunner from "../services/surveyRunner";
import templateList from "../services/templatelist";
import thunk from "redux-thunk";
import units from "../services/units";
import user from "../services/user";
import userList from "../services/userlist";

const reducers = {
    dashboards,
    error,
    indicators,
    layout,
    loading,
    locale,
    login,
    message,
    notification,
    documents,
    resultIndicators,
    resultModels,
    surveyList,
    surveyRunner,
    templateList,
    units,
    userList,
    user
};

const logger = store => next => action => {

    let result = next(action);

    if ( process.env.NODE_ENV !== "production" ) {
        /* eslint-disable */
        console.group(action.type);
        console.info("Dispatching:", action);
        console.log("Next state:", store.getState());
        console.groupEnd(action.type);
        /* eslint-enable */
    }

    return result;
};

export default createStore(combineReducers(reducers), applyMiddleware(thunk, logger));
