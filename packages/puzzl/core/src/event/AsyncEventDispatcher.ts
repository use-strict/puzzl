export interface IAsyncEventListener<TSender, TArgs> {
    (args: TArgs, sender: TSender): Promise<void> | void;
}

export interface IAsyncEvent<TSender, TArgs> {
    subscribe(listener: IAsyncEventListener<TSender, TArgs>): void;
    subscribeOnce(listener: IAsyncEventListener<TSender, TArgs>): void;
    unsubscribe(listener: IAsyncEventListener<TSender, TArgs>): void;
}

/**
 * Async message queue. Same as EventDispatcher, but listeners can return a Promise
 * instead of a regular value.
 * @see EventDispatcher
 */
export class AsyncEventDispatcher<TSender, TArgs> implements IAsyncEvent<TSender, TArgs> {
    private listeners = new Set<IAsyncEventListener<TSender, TArgs>>();

    subscribe(listener: IAsyncEventListener<TSender, TArgs>) {
        this.listeners.add(listener);
    }

    unsubscribe(listener: IAsyncEventListener<TSender, TArgs>) {
        this.listeners.delete(listener);
    }

    subscribeOnce(listener: IAsyncEventListener<TSender, TArgs>) {
        let wrapper = (args: TArgs, sender: TSender) => {
            this.unsubscribe(wrapper);
            wrapper = (void 0)!;
            return listener(args, sender);
        };
        this.subscribe(wrapper);
    }

    dispatch(sender: TSender, args: TArgs) {
        let promiseChain = Promise.resolve();
        this.listeners.forEach(listener => {
            promiseChain = promiseChain.then(() => listener(args, sender));
        });
        return promiseChain;
    }

    asEvent() {
        return this as IAsyncEvent<TSender, TArgs>;
    }
}
