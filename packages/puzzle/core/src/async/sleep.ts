import {CancellationToken, OperationCanceledError} from "./cancellation";

/**
 * Wrapper for setTimeout as cancellable async function
 *
 * Example:
 * ```ts
 * console.log("then");
 * await sleep(1000);
 * console.log("now");
 * ```
 */
export function sleep(millis: number, cancellationToken?: CancellationToken) {
    let timeoutId: number;
    return new Promise<void>((resolve, reject) => {
        timeoutId = setTimeout(() => {
            resolve();
            timeoutId = (void 0)!;
        }, millis);

        if (cancellationToken) {
            cancellationToken.register(() => {
                clearTimeout(timeoutId);
                timeoutId = (void 0)!;
                reject(new OperationCanceledError(cancellationToken));
            });
        }
    });
}
