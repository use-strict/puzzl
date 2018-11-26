import { CancellationToken } from "./CancellationToken";

export class OperationCanceledError extends Error {
    constructor(public cancellationToken: CancellationToken) {
        super();
    }
}
