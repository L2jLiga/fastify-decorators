export class Deferred<T = void> {
  #reject!: (reason?: Error) => void;
  #resolve!: (value: T | PromiseLike<T>) => void;
  readonly #promise: Promise<T> = new Promise<T>((resolve, reject) => {
    this.#reject = reject;
    this.#resolve = resolve;
  });

  get reject(): (reason?: Error) => void {
    return this.#reject || (() => {});
  }

  get resolve(): (value: T | PromiseLike<T>) => void {
    return this.#resolve || (() => {});
  }

  get promise(): Promise<T> {
    return this.#promise;
  }
}
