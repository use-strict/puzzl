export class HttpRequestError extends Error {
    public name = "HttpRequestError";
    constructor(public status: number, public response: string) {
        super(`Server returned HTTP status code ${status}`);
    }
}
