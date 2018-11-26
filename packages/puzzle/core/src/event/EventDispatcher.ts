export interface IEventListener<TSender, TArgs> {
    (args: TArgs, sender: TSender): void;
}

export interface IEvent<TSender, TArgs> {
    subscribe(listener: IEventListener<TSender, TArgs>): void;
    subscribeOnce(listener: IEventListener<TSender, TArgs>): void;
    unsubscribe(listener: IEventListener<TSender, TArgs>): void;
}

/**
 * Creates a synchronous event/message channel. One instance is created per event type,
 * allowing a type-safe listener/callback that receives the correct event parameters.
 *
 * Example:
 * ```
 * class Task {
 *     private _onStart = new EventDispatcher<this, number>();
 *     private _onFinish = new EventDispatcher<this, void>();
 *
 *     // ES6 getter hides the dispatch() method,
 *     // allowing the consumer only to subscribe/unsubscribe
 *     get onStart() {
 *         return this._onStart.asEvent();
 *     }
 *
 *     get onFinish() {
 *         return this._onFinish.asEvent();
 *     }
 *
 *     run() {
 *         let runId = 1;
 *         this._onStart.dispatch(this, runId);
 *         // do something
 *         this._onFinish.dispatch(this, void 0);
 *     }
 * }
 *
 * class Consumer {
 *     constructor(task: Task) {
 *         task.onStart.subscribe((runId) => {
 *              console.log("Task started with id", runId);
 *         });
 *         task.onFinish.subscribe(() => {
 *              console.log("Task finished");
 *         });
 *     }
 * }
 * ```
 */
export class EventDispatcher<TSender, TArgs> implements IEvent<TSender, TArgs> {
    private listeners = new Set<IEventListener<TSender, TArgs>>();

    subscribe(listener: IEventListener<TSender, TArgs>) {
        this.listeners.add(listener);
    }

    unsubscribe(listener: IEventListener<TSender, TArgs>) {
        this.listeners.delete(listener);
    }

    subscribeOnce(listener: IEventListener<TSender, TArgs>) {
        let wrapper = (args: TArgs, sender: TSender) => {
            listener(args, sender);
            this.unsubscribe(wrapper);
            wrapper = (void 0)!;
        };
        this.subscribe(wrapper);
    }

    dispatch(sender: TSender, args: TArgs) {
        this.listeners.forEach(listener => listener(args, sender));
    }

    /**
     * Returns this instance casted as an IEvent, hiding the dispatch() method
     */
    asEvent() {
        return this as IEvent<TSender, TArgs>;
    }
}
