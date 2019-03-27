import { HttpRequestError } from "./HttpRequestError";

export interface IHttpRequestOptions {
    /** See XMLHttpRequest method */
    method?: string;
    timeout?: number;
    /**
     * Data to send with the request (see XMLHttpRequest#send)
     */
    data?: any;
    /**
     * Specifies what type of data the 'data' property contains (default Json)
     */
    dataType?: DataType;
    headers?: Record<string, string>;
}

export enum DataType {
    /** data is a {key: value} object which will be stringified before being sent */
    Json = 0,
    /** data is passed directly to XMLHttpRequest#send without any preprocessing */
    Raw
}

/**
 * Promise-based wrapper around XMLHttpRequest
 *
 * Expects response status to be 2xx. Throws HttpRequestError otherwise.
 *
 * Example:
 * ```ts
 * try {
 *     let data = await (new HttpRequest()).fetch("/posts");
 *     console.log(data)
 * } catch (e) {
 *     if (e instanceof HttpRequestError) {
 *         if (e.status === 504) {
 *             // do something special
 *         }
 *     }
 * }
 * ```
 */
export class HttpRequest {
    fetch(url: string, options?: IHttpRequestOptions) {
        return new Promise<string>((resolve, reject) => {
            let request = new XMLHttpRequest();
            request.addEventListener("load", e => {
                let target = e.target as XMLHttpRequest;
                if (target.status >= 200 && target.status < 300) {
                    resolve(target.responseText);
                } else {
                    reject(new HttpRequestError(target.status, target.response));
                }
            });
            request.addEventListener("error", e => {
                reject(e);
            });

            let data: any = void 0;
            let method = "GET";
            if (options) {
                if (options.method) {
                    method = options.method;
                }
            }
            request.open(method, url, true);

            if (options) {
                if (options.timeout) {
                    request.timeout = options.timeout;
                }
                if (options.data) {
                    if (method.toLowerCase() === "get") {
                        throw new Error(`Can't send data with GET method. Use POST instead`);
                    }

                    let dataType = options.dataType || DataType.Json;
                    if (dataType === DataType.Json) {
                        request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
                        data = JSON.stringify(options.data);
                    } else {
                        data = options.data;
                    }
                }

                const headers = options.headers;
                if (headers) {
                    Object.keys(headers).forEach(headerName => {
                        request.setRequestHeader(headerName, headers[headerName]);
                    });
                }
            }

            request.send(data);
        });
    }

    async fetchJson<T>(url: string, options?: IHttpRequestOptions) {
        const r = await this.fetch(url, options);
        return JSON.parse(r) as T;
    }
}
