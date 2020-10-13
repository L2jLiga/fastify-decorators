export class Deferred<T = void> {
    private readonly _promise: Promise<T>;
    private _reject!: (reason?: Error) => void;
    private _resolve!: (value?: (PromiseLike<T> | T)) => void;

    constructor() {
        this._promise = new Promise<T>((resolve, reject) => {
                this._resolve = resolve
                this._reject = reject
            }
        )
    }

    get promise() {
        return this._promise
    }

    get reject(): (reason?: Error) => void {
        return this._reject;
    }

    get resolve(): (value?: (PromiseLike<T> | T)) => void {
        return this._resolve;
    }
}
