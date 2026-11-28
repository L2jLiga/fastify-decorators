export { default as ErrorHandlerHelper } from './ErrorHandlerHelper/ErrorHandlerHelper';
export * as ClassPropsHelper from './ClassPropsHelper/ClassPropsHelper';
export * as DepScopeHelper from './DepScopeHelper';
export { default as ControllerHelper } from './ControllerHelper/ControllerHelper';
export * as MethodPatcher from './MethodPatcher';
export * as SwaggerHelper from './SwaggerHelper/SwaggerHelper';
export * from './DepInjector/DepInjector';

export class Container<T> implements Iterable<T> {
  private _values: T[] = [];

  constructor(private _parent?: Container<T>) {}

  *[Symbol.iterator](): IterableIterator<T> {
    if (this._parent) yield* this._parent;
    yield* this._values;
  }

  push(...items: T[]): void {
    this._values.push(...items);
  }

  get length(): number {
    let length = 0;
    if (this._parent) length += this._parent.length;
    length += this._values.length;
    return length;
  }
}
