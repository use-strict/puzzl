import { EventDispatcher } from "../event/EventDispatcher";
import { CancellationToken, CancellationTokenSource } from "./cancellation";

enum TaskStatus {
    NotStarted,
    InProgress,
    Finished,
    Error
}

export interface IAsyncCallback<TResult> {
    (cancellationToken: CancellationToken): Promise<TResult>;
}

/**
 * Wraps an async function allowing to do actions based on its state of execution
 * (run, re-run, cancel, wait to finish)
 *
 * Similar to a regular Promise with a few key differences:
 * 1. The constructor argument is not executed immediately, but instead when start() is invoked.
 * 2. We can intercept the result (or the rejection/error) regardless of the current state of the task
 * 3. We can cancel/stop the task, by providing a CancellationToken to the constructor argument
 *
 * Example:
 * ```typescript
 * interface IBlogPost {
 *      title: string;
 * }
 * let fetchTask = new Task<IBlogPost>(() => fetch("/data.json"));
 * //... in some click handler
 * fetchTask.cancel(); // Cancels if necessary
 * let blogPost = await fetchTask.start();
 * console.log(blogPost.title);
 * ```
 */
export class Task<TResult> {
    private status = TaskStatus.NotStarted;
    private lastResult: TResult | undefined;
    private lastError: any;
    private tokenSource: CancellationTokenSource;

    private onTaskEnded = new EventDispatcher<this, void>();

    constructor(private func: IAsyncCallback<TResult>) {
        this.tokenSource = new CancellationTokenSource();
    }

    /** Reset the task to its initial (not started) state */
    async reset() {
        if (this.status === TaskStatus.InProgress) {
            throw new Error(`Can't reset a running task`);
        }

        this.status = TaskStatus.NotStarted;
        this.lastResult = (void 0)!;
        this.lastError = void 0;
    }

    /** Cancel a running task */
    cancel() {
        if (this.status === TaskStatus.InProgress) {
            this.tokenSource.cancel();
        }
    }

    async start() {
        if (this.status !== TaskStatus.NotStarted) {
            throw new Error(`Task already started or completed`);
        }

        try {
            this.lastError = void 0;
            this.lastResult = (void 0)!;
            this.status = TaskStatus.InProgress;
            this.lastResult = await this.func(this.tokenSource.token);
            this.status = TaskStatus.Finished;
        } catch (e) {
            this.lastError = e;
            this.status = TaskStatus.Error;
        }
        this.onTaskEnded.dispatch(this, void 0);
        if (this.status === TaskStatus.Error) {
            throw this.lastError;
        } else {
            return this.lastResult as TResult;
        }
    }

    /** Waits for task completion and returns the result (or throws an error respectively) */
    async wait() {
        if (this.status === TaskStatus.Error) {
            return Promise.reject(this.lastError);
        } else if (this.status === TaskStatus.Finished) {
            return Promise.resolve(this.lastResult as TResult);
        } else if (this.status === TaskStatus.InProgress) {
            return new Promise<TResult>((resolve, reject) => {
                this.onTaskEnded.subscribeOnce(() => {
                    if (this.status === TaskStatus.Finished) {
                        resolve(this.lastResult);
                    } else {
                        reject(this.lastError);
                    }
                });
            });
        } else if (this.status === TaskStatus.NotStarted) {
            throw new Error(`Can't wait for task that was not even started`);
        } else {
            throw new Error(`Unknown task state ${this.status}`);
        }
    }

    /** Starts the task or waits for completion if already started */
    async startOrWait() {
        if (this.status === TaskStatus.NotStarted) {
            return await this.start();
        } else {
            return await this.wait();
        }
    }
}
