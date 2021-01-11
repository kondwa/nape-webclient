/*
 * Copyright (c) 2018 Mainlevel Consulting AG
 */
import {TYPE_KEY} from "../common/constant";

const SCROLL_CHANGED = "SCROLL_CHANGED";

export const SCROLL_TOP = "scrollTop";

const initialState = {
    [SCROLL_TOP]: undefined,
};

export default function reducer(state = initialState, action) {
    let newState;

    switch (action[TYPE_KEY]) {

        case SCROLL_CHANGED:
            newState = {
                ...state,
                [SCROLL_TOP]: [action[SCROLL_TOP]],
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

export function scrollTo(scrollTop) {

    return (dispatch) => {

        dispatch({
            [TYPE_KEY]: SCROLL_CHANGED,
            [SCROLL_TOP]: scrollTop
        });
    };
}
