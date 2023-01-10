/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

export class Container<T> implements Iterable<T> {
  private _values: T[] = [];

  constructor(private _parent?: Container<T>) {}

  *[Symbol.iterator](): IterableIterator<T> {
    if (this._parent) yield* this._parent;
    yield* this._values;
  }

  push(...items: T[]) {
    this._values.push(...items);
  }

  get length() {
    let length = 0;
    if (this._parent) length += this._parent.length;
    length += this._values.length;
    return length;
  }
}
