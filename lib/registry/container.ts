/**
 * Container for storing objects
 * Can handle hierarchy as well
 *
 * @experimental
 */
export class Container<T, K = T> implements Iterable<T> {
  private readonly _values = new Map<K, T>();

  constructor(private _parent?: Container<T, K>) {}

  public *[Symbol.iterator](): IterableIterator<T> {
    if (this._parent) yield* this._parent;
    yield* this._values.values();
  }

  public setParent(parent: Container<T, K>): void {
    this._parent = parent;
  }

  public set(key: K, value: T): void {
    this._values.set(key, value);
  }

  public get(key: K): T | null {
    if (this._values.has(key)) {
      return this._values.get(key) ?? null;
    }
    return this._parent?.get(key) ?? null;
  }

  public push(...items: T[]): void {
    items.forEach((item) => this._values.set(item as unknown as K, item));
  }

  public get length(): number {
    let length = 0;
    if (this._parent) length += this._parent.length;
    length += this._values.size;
    return length;
  }
}
