import { HTTP_STATUS_OK, TYPE_KEY } from "../common/constant";

import rest from "../common/rest";

// Actions
const RECEIVING_JWT_EXPIRED_HEARTBEAT_FAILED = "RECEIVING_JWT_VERIFICATION_HEARTBEAT_FAILED";
const RECEIVING_JWT_EXPIRED_HEARTBEAT_SUCCEEDED = "RECEIVING_JWT_VERIFICATION_HEARTBEAT_SUCCEEDED";
const REQUESTING_JWT_EXPIRED_HEARTBEAT_FAILED = "REQUESTING_JWT_EXPIRED_HEARTBEAT_FAILED";

// Fieldnames in State
export const JWT_EXPIRED_HEARTBEAT = "jwtExpired";
export const REQUEST_FAILED_COUNT = "requestFailedCount";

const REQUEST_COUNT_INCREMENT = 1;

const initialState = {
    [ JWT_EXPIRED_HEARTBEAT ]: false,
    [ REQUEST_FAILED_COUNT ]: 0
};

export default function reducer( state = initialState, action ) {
    let newState;

    switch ( action[ TYPE_KEY ] ) {

        case RECEIVING_JWT_EXPIRED_HEARTBEAT_SUCCEEDED:
            newState = {
                ...state,
                [ JWT_EXPIRED_HEARTBEAT ]: false,
                [ REQUEST_FAILED_COUNT ]: 0
            };
            break;

        case RECEIVING_JWT_EXPIRED_HEARTBEAT_FAILED:
            newState = {
                ...state,
                [ JWT_EXPIRED_HEARTBEAT ]: true
            };
            break;
        case REQUESTING_JWT_EXPIRED_HEARTBEAT_FAILED:
            newState = {
                ...state,
                [ REQUEST_FAILED_COUNT ]: state[ REQUEST_FAILED_COUNT ] + REQUEST_COUNT_INCREMENT
            };
            break;

        default:
            newState = { ...state };
            break;
    }

    return newState;
}

export function callJwtVerification() {

    return ( dispatch, getState ) => {
        if ( `${window.de.mainlevel.REQUEST_RETRY_LIMIT}` > getState().user[ REQUEST_FAILED_COUNT ] ) {
            rest.doGet(`${window.de.mainlevel.BASE_URL}/authentication/token/verify`).then(( response ) => {
                dispatch(receiveTokenSuccess(response.status));
            }, () => {
                dispatch(receiveTokenFailed());
            });
        } else {
            dispatch(receiveTokenExpired());
        }

    };
}

function receiveTokenSuccess( status ) {
    const statusCode = status === HTTP_STATUS_OK ? RECEIVING_JWT_EXPIRED_HEARTBEAT_SUCCEEDED : REQUESTING_JWT_EXPIRED_HEARTBEAT_FAILED;
    return {
        [ TYPE_KEY ]: statusCode
    };
}

function receiveTokenFailed() {
    return {
        [ TYPE_KEY ]: REQUESTING_JWT_EXPIRED_HEARTBEAT_FAILED
    };
}

function receiveTokenExpired() {
    return {
        [ TYPE_KEY ]: RECEIVING_JWT_EXPIRED_HEARTBEAT_FAILED
    };
}

