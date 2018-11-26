// See https://gist.github.com/danharper/ad6ca574184589dea28d
// Similar to the CancellationToken API from C#

import { EventDispatcher } from "../../event/EventDispatcher";
import { CancellationToken } from "./CancellationToken";
import { CANCEL, REGISTER } from "./internal";

/**
 * A token source creates a `CancellationToken` and has the ability to cancel it.
 * The token is passed to cancellable functions as a parameter
 *
 * e.g:
 * ```typescript
 * async function caller() {
 *     let tokenSource = new CancellationTokenSource();
 *     try {
 *          await cancellable(tokenSource.token);
 *     } catch (e) {
 *         if (e instanceof OperationCanceledError) {
 *             console.warn("Cancelled");
 *         } else {
 *             throw e;
 *         }
 *     }
 * }
 * async function cancellable(token: CancellationToken) {
 *     // Long-running iteration
 *     for (let i = 0; i < 1000; i++) {
 *         await new Promise(resolve => setTimeout(resolve, 1000));
 *         // Check if the token is cancelled after every iteration
 *         token.throwIfCancelled();
 *     }
 * }
 * ```
 */
export class CancellationTokenSource {
    public token: CancellationToken;
    private onCancel = new EventDispatcher<this, void>();

    constructor() {
        this.token = new CancellationToken(this);
    }

    /**
     * Issues token cancellation and notifies any registered callbacks
     */
    cancel() {
        (this.token as any)[CANCEL]();
        this.onCancel.dispatch(this, void 0);
    }

    /**
     * @internal method only callable from CancellationToken
     */
    [REGISTER](callback: () => void) {
        this.onCancel.subscribe(() => callback());
        if (this.token.isCancelled()) {
            callback();
        }
    }
}
