import { EventDispatcher, IEvent } from "../event/EventDispatcher";

/**
 * Store a primitive value inside an object, so it can be passed by reference
 *
 * This is particularly useful when passing primitives with dependency injection,
 * because their value might not be known at construction time.
 * See variable boxing/unboxing in Java or C#.
 */
export class BoxedVar<T> {
    private _value: T | undefined;
    private _onChange = new EventDispatcher<this, T | undefined>();

    constructor(value?: T) {
        if (value !== void 0) {
            this.value = value;
        }
    }

    get value() {
        return this._value;
    }

    set value(value: T | undefined) {
        this._value = value;
        this._onChange.dispatch(this, value);
    }

    get onChange(): IEvent<this, T | undefined> {
        return this._onChange;
    }
}
