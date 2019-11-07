import { CancellationToken, OperationCanceledError } from "@puzzl/core/lib/async/cancellation";

/**
 * Animated scroll using Element#scrollTop and requestAnimationFrame
 */
export function scrollElementToY(element: HTMLElement, newScrollTop: number, durationMillis: number,
    cancellationToken?: CancellationToken) {

    let scrollTarget: IScrollTarget = {
        getScrollY: () => element.scrollTop,
        scrollToY: (offset) => element.scrollTop = offset
    };
    return scrollToY(scrollTarget, newScrollTop, durationMillis, cancellationToken);
}


/**
 * Animated scroll using window#scrollTo(x, y) and requestAnimationFrame
 */
export function scrollWindowToY(window: Window, newScrollTop: number, durationMillis: number,
    cancellationToken?: CancellationToken) {

    let scrollTarget: IScrollTarget = {
        getScrollY: () => window.scrollY,
        scrollToY: (offset) => window.scrollTo(window.scrollX, offset)
    }
    return scrollToY(scrollTarget, newScrollTop, durationMillis, cancellationToken);
}

interface IScrollTarget {
    getScrollY(): number;
    scrollToY(offset: number): void;
}

function scrollToY(target: IScrollTarget, newScrollTop: number, durationMillis: number,
    cancellationToken?: CancellationToken) {

    let initialScroll = target.getScrollY();
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
            target.scrollToY(initialScroll + direction * scrolledAmount);

            if (scrolledAmount < totalScrollAmount) {
                requestAnimationFrame(step);
            } else {
                resolve();
            }
        };

        requestAnimationFrame(step);
    });
}
