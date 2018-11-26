import { CancellationToken, OperationCanceledError } from "@puzzl/core/lib/async/cancellation";

/**
 * Animated scroll using Element#scrollTop and requestAnimationFrame
 */
export function scrollElementToY(container: HTMLElement, newScrollTop: number, durationMillis: number,
    cancellationToken?: CancellationToken) {

    let initialScroll = container.scrollTop;
    let totalScrollAmount = Math.abs(newScrollTop - initialScroll);
    let scrolledAmount = 0;
    let direction = Math.sign(newScrollTop - initialScroll);

    let lastTime = Date.now();

    return new Promise<void>((resolve, reject) => {
        let step = () => {
            if (cancellationToken && cancellationToken.isCancelled()) {
                reject(new OperationCanceledError(cancellationToken));
            }
            let currentTime = Date.now();
            let elapsedTime = currentTime - lastTime;
            lastTime = currentTime;

            let deltaScroll = Math.min(
                totalScrollAmount * elapsedTime / durationMillis,
                totalScrollAmount - scrolledAmount
            );

            scrolledAmount += deltaScroll;
            container.scrollTop = initialScroll + direction * scrolledAmount;

            if (scrolledAmount < totalScrollAmount) {
                requestAnimationFrame(step);
            } else {
                resolve();
            }
        };

        requestAnimationFrame(step);
    });
}
