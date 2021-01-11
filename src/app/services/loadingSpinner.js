import { TYPE_KEY } from "../common/constant";

export const BEGIN_LOADING = "BEGIN_LOADING";
export const END_LOADING = "END_LOADING";

export const INSTANT = "instant";
export const OPEN = "open";
export const COUNT = "count";

export const initialState = {
    [OPEN]: false,
    [COUNT]: 0
};

export default function reducer( state = initialState, action ) {
    let newState;
    switch ( action[ TYPE_KEY ] ) {

        case BEGIN_LOADING:
            newState = {
                ...state,
                [OPEN]: true,
                [COUNT]: state[COUNT] ? state[COUNT] + 1 : 1
            };
            break;

        case END_LOADING:
            newState = {
                ...state,
                [OPEN]: action[INSTANT] ? false : state[COUNT] > 1,
                [COUNT]: action[INSTANT] ? 0 : state[COUNT] ? state[COUNT] - 1 : 0
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

export function beginLoading() {
    return {
        [TYPE_KEY]: BEGIN_LOADING
    };
}

export function endLoading(instant = false) {
    return {
        [TYPE_KEY]: END_LOADING,
        [INSTANT] : instant
    };
}
