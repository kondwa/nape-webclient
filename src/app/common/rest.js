import {Base64} from "js-base64";
import reqwest from "reqwest";
import store from "./store";

const AUTHORIZATION_KEY = "Authorization";
const ACCEPT_KEY = "Accept";
const CONTENT_TYPE_KEY = "Content-Type";
const CROSS_ORIGIN_KEY = "crossOrigin";
const HEADERS_KEY = "headers";
const METHOD_KEY = "method";
const TYPE_KEY = "type";

const APPLICATION_JSON = "application/json";
const JSON_VALUE = "json";
const GET = "GET";
const POST = "POST";
const PUT = "PUT";
const DELETE = "DELETE";

class Rest {

    doLogin(url, username, password) {
        const base64Credentials = Base64.encode(`${username}:${password}`),
            requestOptions = {
                url,
                [TYPE_KEY]: JSON_VALUE,
                [METHOD_KEY]: GET,
                [CROSS_ORIGIN_KEY]: process.env.NODE_ENV !== "production",
                [HEADERS_KEY]: {
                    [ACCEPT_KEY]: APPLICATION_JSON,
                    [AUTHORIZATION_KEY]: `Basic ${base64Credentials}`
                }
            };
        return reqwest(requestOptions);
    }

    doGet(url, accept = APPLICATION_JSON) {
        const requestOptions = {
            url,
            [TYPE_KEY]: accept === "text/csv" ? "text" : JSON_VALUE,
            [METHOD_KEY]: GET,
            [CROSS_ORIGIN_KEY]: process.env.NODE_ENV !== "production",
            [HEADERS_KEY]: {
                [AUTHORIZATION_KEY]: `Bearer ${store.getState().login.token}`,
                [ACCEPT_KEY]: accept
            }
        };
        return reqwest(requestOptions);
    }

    doGetWithToken(url, token, accept = APPLICATION_JSON) {
        const requestOptions = {
            url,
            [TYPE_KEY]: accept === "text/csv" ? "text" : JSON_VALUE,
            [METHOD_KEY]: GET,
            [CROSS_ORIGIN_KEY]: process.env.NODE_ENV !== "production",
            [HEADERS_KEY]: {
                [AUTHORIZATION_KEY]: `Bearer ${token ? token : store.getState().login.token}`,
                [ACCEPT_KEY]: APPLICATION_JSON
            }
        };
        return reqwest(requestOptions);
    }

    doPost(url, data) {
        const requestOptions = {
            url,
            [TYPE_KEY]: JSON_VALUE,
            [METHOD_KEY]: POST,
            [CROSS_ORIGIN_KEY]: process.env.NODE_ENV !== "production",
            [HEADERS_KEY]: {
                [AUTHORIZATION_KEY]: `Bearer ${store.getState().login.token}`,
                [ACCEPT_KEY]: APPLICATION_JSON,
                [CONTENT_TYPE_KEY]: APPLICATION_JSON
            },
            data
        };
        return reqwest(requestOptions);
    }

    doPostFileUpload(url, data) {
        const requestOptions = {
            url,
            [TYPE_KEY]: JSON_VALUE,
            [METHOD_KEY]: POST,
            [CROSS_ORIGIN_KEY]: process.env.NODE_ENV !== "production",
            [HEADERS_KEY]: {
                [AUTHORIZATION_KEY]: `Bearer ${store.getState().login.token}`,
                [ACCEPT_KEY]: APPLICATION_JSON,
                [CONTENT_TYPE_KEY]: APPLICATION_JSON
            },
            data: JSON.stringify(data)
        };

        return reqwest(requestOptions);
    }

    doPut(url, data) {
        const requestOptions = {
            url,
            [TYPE_KEY]: JSON_VALUE,
            [METHOD_KEY]: PUT,
            [CROSS_ORIGIN_KEY]: process.env.NODE_ENV !== "production",
            [HEADERS_KEY]: {
                [AUTHORIZATION_KEY]: `Bearer ${store.getState().login.token}`,
                [ACCEPT_KEY]: APPLICATION_JSON,
                [CONTENT_TYPE_KEY]: APPLICATION_JSON
            },
            data
        };
        return reqwest(requestOptions);
    }

    doDelete(url, data) {
        const requestOptions = {
            url,
            [TYPE_KEY]: JSON_VALUE,
            [METHOD_KEY]: DELETE,
            [CROSS_ORIGIN_KEY]: process.env.NODE_ENV !== "production",
            [HEADERS_KEY]: {
                [AUTHORIZATION_KEY]: `Bearer ${store.getState().login.token}`,
                [CONTENT_TYPE_KEY]: APPLICATION_JSON
            },
            data
        };
        return reqwest(requestOptions);
    }

    doExport(url, accept) {
        const requestOptions = {
            method: "GET",
            responseType: "blob",
            headers: {
                Authorization: `Bearer ${store.getState().login.token}`,
                Accept: accept
            }
        };

        return fetch(url, requestOptions);
    }
}

export default new Rest();
