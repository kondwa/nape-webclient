/* eslint-disable no-dupe-keys,no-param-reassign */

// TODO: AnswerUtil!

const ANSWER_TYPE_OPTION = "OPTION";
const ANSWER_TYPE_VALUE = "VALUE";


export function createValueAnswer(value) {
    return {
        "answer": {
            "type": ANSWER_TYPE_VALUE,
            "value": value
        },
        "order": null,
        "title": ""
    };
}

export function createSelectionAnswer(option) {
    return {
        "answer": {
            "type": ANSWER_TYPE_OPTION,
            "option": option,
            "value": option.name
        },
        "order": null,
        "title": ""
    };
}

export function createMatrixAnswer(option, rowIndex, rowTitle) {
    return {
        "answer": {
            "type": ANSWER_TYPE_OPTION,
            "option": option,
            "value": option.name
        },
        "order": rowIndex,
        "title": rowTitle
    };
}

