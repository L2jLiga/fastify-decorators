export class Deferred<T = void> {
    get promise(): Promise<T> {
        return this._promise;
    }

    get resolve(): (value: T | PromiseLike<T>) => void {
        return this._resolve;
    }

    get reject(): (reason?: Error) => void {
        return this._reject;
    }

    private readonly _promise: Promise<T> = new Promise<T>((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        },
    );

    private _resolve!: (value: T | PromiseLike<T>) => void;
    private _reject!: (reason?: Error) => void;
}
