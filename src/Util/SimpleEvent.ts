
export class SimpleEvent implements ISimpleEventBase {
    private _idx: number = 0;


    private _key: string = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);


    private subscribers: Function[] = [];



    /** function that gets called in the event that an error is thrown
     * return true to stop calling other subscribers
     */
    public onError: (e) => boolean = () => false;

    /** adds new subscriber
     *  @returns refrence number used to remove subscriber */
    on(fn: Function): number {
        fn[this._key] = ++this._idx;
        this.subscribers.push(fn);
        return fn[this._key];
    }

    /** Triggers the event */
    trigger(): SimpleEvent;
    trigger(...args: any[]): SimpleEvent;
    trigger(...args: any[]): SimpleEvent {
        for (var f of this.subscribers) {
            try {
                f.apply({}, args);
            }
            catch (e) {
                if (this.onError(e))
                    break;
            }
        }

        return this;
    }

    clear(): SimpleEvent {
        this.subscribers = [];
        return this;
    }


    off(id: number);
    off(fn: Function);
    off(arg) {
        var id = 0;

        if (typeof arg === 'number') {
            id = arg;
        } else if (typeof arg === 'Function') {
            id = arg[this._key];
        } else {
            throw "SimpleEvent.off: Function Identifier not found";
        }

        this.subscribers = this.subscribers.filter(fn=> fn[this._key] !== id);

    }



    count(): number {
        return this.subscribers.length;
    }


    dispose() { this.clear(); }


    static New(): SimpleEvent;
    static New<T>(): ISimpleEvent1<T>;
    static New<T1, T2>(): ISimpleEvent2<T1, T2>;
    static New<T1, T2, T3>(): ISimpleEvent3<T1, T2, T3>;
    static New() { return new SimpleEvent(); }
}

export interface ISimpleEventBase {

    off(id: number);
    off(fn: Function);

    count(): number;
    trigger(): SimpleEvent;
    dispose();
    clear();
}

export interface ISimpleEvent1<T> extends ISimpleEventBase {
    on(fn: (e: T) => void): number;
    trigger(): SimpleEvent;
    trigger(data: T): SimpleEvent;
}

export interface ISimpleEvent2<T1, T2> extends ISimpleEventBase {
    on(fn: (e: T1, e2: T2) => void): number;
    trigger(): SimpleEvent;
    trigger(data: T1, a2: T2): SimpleEvent;
}

export interface ISimpleEvent3<T1, T2, T3> extends ISimpleEventBase {
    on(fn: (e: T1, e2: T2, e3: T3) => void): number;
    trigger(): SimpleEvent;
    trigger(data: T1, a2: T2, a3: T3): SimpleEvent;
}
