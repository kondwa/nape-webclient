/* eslint-disable no-param-reassign,array-callback-return */
import {
    PROPERTY_NAME,
    PROPERTY_VALUE,
    TYPE_KEY
} from "../common/constant";
import { beginLoading, endLoading } from "./loadingSpinner";
import { createErrorMessages, messagesReceived } from "./message";

import find from "lodash/find";
import history from "../common/history";
import indexOf from "lodash/indexOf";
import rest from "../common/rest";
import { showNotification } from "./notification";

const LOAD_SURVEYS_INSTANCE_ACTION = "SURVEY.LOAD_SURVEYS_INSTANCE_ACTION";
const PROPERTY_CHANGED_ACTION = "SURVEY.PROPERTY_CHANGED_ACTION";
const ADD_ANSWER_ACTION = "SURVEY.ADD_ANSWER_ACTION";
const REMOVE_ANSWER_ACTION = "SURVEY.REMOVE_ANSWER_ACTION";
const ACTIVATE_TRIGGERS_ACTION = "SURVEY.ACTIVATE_TRIGGERS_ACTION";

export const SURVEY_INSTANCE = "surveyInstance";
export const QUESTIONS = "questions";
export const ANSWER = "answer";
export const QUESTION_MODEL = "questionModel";
export const SURVEY_RESULT_CHANGED = "surveyResultChanged";
export const TOKEN = "surveyToken";
export const VISIBILITY_TYPE = "visibilityType";

const initialState = {
    [QUESTIONS]: null,
    [SURVEY_INSTANCE]: null,
    [SURVEY_RESULT_CHANGED]: false
};

export default function reducer(state = initialState, action) {
    let newState;
    let surveyInstance;
    let questions = [];

    switch (action[TYPE_KEY]) {
        case LOAD_SURVEYS_INSTANCE_ACTION:
            newState = {
                ...state,
                [SURVEY_INSTANCE]: action[SURVEY_INSTANCE],
                [QUESTIONS]: action[QUESTIONS],
                [TOKEN]: action[TOKEN],
                [VISIBILITY_TYPE]: action[VISIBILITY_TYPE]
            };
            break;
        case ADD_ANSWER_ACTION:
            surveyInstance = handleAddAnswer(state[SURVEY_INSTANCE], action[QUESTION_MODEL], action[ANSWER]);

            // TODO Make this more beautiful
            surveyInstance.pages.map(page => {
                page.questions.map(question => questions.push(question));
            });

            newState = {
                ...state,
                [SURVEY_INSTANCE]: surveyInstance,
                [QUESTIONS]: questions
            };
            break;
        case REMOVE_ANSWER_ACTION:
            surveyInstance = handleRemoveAnswer(state[SURVEY_INSTANCE], action[QUESTION_MODEL], action[ANSWER]);

            // TODO Make this more beautiful
            surveyInstance.pages.map(page => {
                page.questions.map(question => questions.push(question));
            });

            newState = {
                ...state,
                [SURVEY_INSTANCE]: surveyInstance,
                [QUESTIONS]: questions
            };
            break;
        case ACTIVATE_TRIGGERS_ACTION:
            surveyInstance = handleTriggers(state[SURVEY_INSTANCE], state[QUESTIONS], action[QUESTION_MODEL]);

            // TODO Make this more beautiful
            surveyInstance.pages.map(page => {
                page.questions.map(question => questions.push(question));
            });

            newState = {
                ...state,
                [SURVEY_INSTANCE]: surveyInstance,
                [QUESTIONS]: questions
            };
            break;
        case PROPERTY_CHANGED_ACTION:
            newState = Object.assign({}, state, {
                [action[PROPERTY_NAME]]: action[PROPERTY_VALUE]
            });
            break;
        default:
            newState = {
                ...state
            };
            break;
    }
    return newState;
}

export function loadSurveyInstance(surveyGid, surveyInstanceGid) {
    return async (dispatch) => {
        try {
            const instance = await rest.doGet(`${window.de.mainlevel.BASE_URL_API}/surveys/${surveyGid}/instances/${surveyInstanceGid}`);
            await dispatch(loadSuccessful(instance));
            history.push("/surveyRunner");
        } catch (er) {
            dispatch(messagesReceived(createErrorMessages(er)));
        }
    };
}

export function saveSurveyInstance() {
    return async (dispatch, getState) => {
        try {
            // start loading animation
            dispatch(beginLoading());

            let surveyGid = getState().surveyList.survey.graphId;
            let surveyInstance = getState().surveyRunner.surveyInstance;
            let surveyInstanceGid = surveyInstance.instanceId;

            const instanceToSave = await rest.doPut(`${window.de.mainlevel.BASE_URL_API}/surveys/${surveyGid}/instances/${surveyInstanceGid}`, JSON.stringify(surveyInstance));

            await dispatch(loadSuccessful(instanceToSave));
            dispatch(showNotification("You have successfully saved your work"));
            dispatch(endLoading());
        } catch (er) {
            dispatch(showNotification("There is some problem with saving your work"));
            dispatch(messagesReceived(createErrorMessages(er)));
        }

    };
}

export function submitSurveyInstance() {
    return async (dispatch, getState) => {
        try {
            // start loading animation
            dispatch(beginLoading());

            const surveyGid = getState().surveyList.survey.graphId;
            let surveyInstance = getState().surveyRunner.surveyInstance;
            surveyInstance.status = "SENT";
            const surveyInstanceGid = surveyInstance.instanceId;

            const instanceToSubmit = await rest.doPut(`${window.de.mainlevel.BASE_URL_API}/surveys/${surveyGid}/instances/${surveyInstanceGid}`, JSON.stringify(surveyInstance));

            await dispatch(loadSuccessful(instanceToSubmit));
            dispatch(showNotification("You have successfully saved your work"));
            dispatch(endLoading());
            //history.push("/leave_survey");
            history.goBack();
        } catch (er) {
            dispatch(endLoading());
            dispatch(messagesReceived(createErrorMessages(er)));
            dispatch(showNotification("There is some problem with saving your work"));
        }
    };
}

export function loadSurveyInstanceAnonymous(token) {
    return async (dispatch) => {
        try {
            const instance = await rest.doPost(`${window.de.mainlevel.BASE_URL_API}/external/surveys/${token}`);
            dispatch(loadSuccessful(instance, token));
        } catch (er) {
            dispatch(messagesReceived(createErrorMessages(er)));
        }
    };
}

export function saveAndSubmitSurveyInstanceAnonymous() {
    return async (dispatch, getState) => {
        try {
            // start loading animation
            dispatch(beginLoading());

            const state = getState();
            const surveyInstance = state.surveyRunner.surveyInstance;
            const token = state.surveyRunner.surveyToken;
            const instanceToSave = await rest.doPut(`${window.de.mainlevel.BASE_URL_API}/external/surveys/${token}`, JSON.stringify(surveyInstance));

            await dispatch(loadSuccessful(instanceToSave));
            dispatch(endLoading());
        } catch (er) {
            dispatch(endLoading());
            dispatch(messagesReceived(createErrorMessages(er)));
        }

    };
}

export function loadSuccessful(surveyInstance, token = "") {
    let questions = [];
    surveyInstance.pages.map(page => {
        page.questions.map(question => questions.push(question));
    });
    return {
        [TYPE_KEY]: LOAD_SURVEYS_INSTANCE_ACTION,
        [SURVEY_INSTANCE]: surveyInstance,
        [QUESTIONS]: questions,
        [TOKEN]: token,
        [VISIBILITY_TYPE]: surveyInstance.surveyVisibilityType
    };
}

function handleTriggers(surveyInstance, questions, question) {

    if (question.triggers) {
        let activeTriggers = [];
        let deactivatedTriggers = [];
        question.triggers.map(trigger => {

            switch (trigger.actionType) {

                case "ACTIVATE": {
                    let targetQuestion = find(questions, (q) => q.index === trigger.targetQuestionIndex);
                    


                    // trigger handling needs to be changed here. We should rather find the trigger than the question
                    // finding the question follows thereafter


                    if (targetQuestion) {

                        let answer;
                        switch (trigger.compareType) {

                            case "EQ": {
                                answer = find(question.answers, (a) => a.answer && a.answer.option && a.answer.option.index === trigger.optionIndex);
                            }
                                break;
                            case "GT": {
                                answer = find(question.answers, (a) => a.answer && a.answer.option && a.answer.option.index > trigger.optionIndex);
                            }
                                break;
                            case "GE": {
                                answer = find(question.answers, (a) => a.answer && a.answer.option && a.answer.option.index >= trigger.optionIndex);
                            }
                                break;
                            default: {
                                answer = find(question.answers, (a) => a.answer && a.answer.option && a.answer.option.index === trigger.optionIndex);
                            }
                        }
                        if(answer){
                            targetQuestion.visible = true;
                            activeTriggers.push(targetQuestion.name);
                            deactivatedTriggers = deactivatedTriggers.filter(deactivatedQuestion => deactivatedQuestion.name !== targetQuestion.name);
                        } else if (activeTriggers.indexOf(targetQuestion.name) === -1){
                            deactivatedTriggers.push(targetQuestion);
                        }
                        
                    }
                }
                    break;

                default:
                    break;
            }
        });
        deactivatedTriggers.map(deactivatedQuestion => {
            deactivatedQuestion.visible = false;
            deactivatedQuestion.answers = [];
            if(deactivatedQuestion.triggers && deactivatedQuestion.triggers.length > 0){
                deactivatedQuestion.triggers.map(trigger => {
                    let targetQuestion = find(questions, (q) => q.index === trigger.targetQuestionIndex);
                    if(targetQuestion){
                        targetQuestion.visible = false;
                        targetQuestion.answers = [];
                    }
                });
            }
        });
    }

    return surveyInstance;
}

function handleAddAnswer(surveyInstance, question, answer) {

    if (answer) {
        let oldAnswer = find(question.answers, (a) => a.answer && a.answer.value === answer.answer.value);

        if (!oldAnswer) {
            question.answers.push(answer);
        }
    }

    return surveyInstance;
}

function handleRemoveAnswer(surveyInstance, question, answer) {

    let index = indexOf(question.answers, answer);

    if (index > -1) {
        question.answers.splice(index, 1);
    }

    return surveyInstance;
}

export function addQuestionAnswer(question, answer) {
    return (dispatch) => {
        dispatch({
            [TYPE_KEY]: ADD_ANSWER_ACTION,
            [ANSWER]: answer,
            [QUESTION_MODEL]: question
        });
        dispatch(propertyChange(SURVEY_RESULT_CHANGED, true));
    };
}

export function removeQuestionAnswer(questionModel, answer) {
    return (dispatch) => {
        dispatch({
            [TYPE_KEY]: REMOVE_ANSWER_ACTION,
            [ANSWER]: answer,
            [QUESTION_MODEL]: questionModel,
        });
        dispatch(propertyChange(SURVEY_RESULT_CHANGED, true));
    };
}

export function activateTriggers(questionModel) {
    return (dispatch) => {
        dispatch({
            [TYPE_KEY]: ACTIVATE_TRIGGERS_ACTION,
            [QUESTION_MODEL]: questionModel,
        });
        dispatch(propertyChange(SURVEY_RESULT_CHANGED, true));
    };
}

export function propertyChange(propertyName, propertyValue) {
    return {
        [TYPE_KEY]: PROPERTY_CHANGED_ACTION,
        [PROPERTY_NAME]: propertyName,
        [PROPERTY_VALUE]: propertyValue
    };
}
