import { EventDispatcher } from "@puzzl/core/lib/event/EventDispatcher";

/**
 * A class that emits an event every second with the current timestamp
 */
class TimestampEmitter {
    private _onChange = new EventDispatcher<number, this>();
    // This ensures the consumer sees only the subscription methods, not the implementation details
    onChange = this._onChange.asEvent();

    start() {
        setInterval(() => {
            this._onChange.dispatch(Date.now(), this);
        }, 1000);
    }
}

class EventsApp {
    main() {
        let timestampEmitter = new TimestampEmitter();
        timestampEmitter.onChange.subscribe(time => {
            console.log(time);
        })
    }
}

new EventsApp().main();
