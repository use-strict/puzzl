// See https://gist.github.com/danharper/ad6ca574184589dea28d
// Similar to the CancellationToken API from C#

import { OperationCanceledError } from "./OperationCanceledError";
import { CancellationTokenSource } from "./CancellationTokenSource";
import { CANCEL, REGISTER } from "./internal";

/**
 * An instance of `CancellationToken` is created by a `CancellationTokenSource` and passed as argument to functions
 * that should be cancellable. The cancellable function can detect and react to the
 * token cancellation in two ways:
 *
 * 1. Call `token.isCancelled()` with a polling mechanism or at key points during its execution
 * 2. Register a callback with `token.register()` that will automatically get called when the token is cancelled
 *
 * When a token cancellation is detected, the function should throw an `OperationCanceledError`,
 * that can be caught by the caller and handled appropriately.
 * For convenience, the `throwIfCancelled` method is provided on the token object
 */
export class CancellationToken {
    private cancelled = false;

    /**
     * Shouldn't be instantiated directly, but through a CancellationTokenSource
     */
    constructor(private source: CancellationTokenSource) {

    }

    /**
     * Throws an OperationCanceledError if the token is in cancelled state
     */
    throwIfCancelled() {
        if (this.isCancelled()) {
            throw new OperationCanceledError(this);
        }
    }

    isCancelled() {
        return this.cancelled === true;
    }

    /** @internal method callable only from CancellationTokenSource */
    [CANCEL]() {
        this.cancelled = true;
    }

    /**
     * Registers a callback to be called when the token is cancelled.
     * If the token is already in cancelled state, the callback is immediately invoked
     */
    register(callback: () => void) {
        (this.source as any)[REGISTER](callback);
    }
}
