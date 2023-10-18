/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { createInitializationHook } from 'fastify-decorators/plugins';
import { INITIALIZER } from '../symbols.js';
import { Deferred } from '../utils/deferred.js';

export const readyMap = new Map<unknown, Promise<void>>();

createInitializationHook('appReady', () => Promise.all(readyMap.values()));

/**
 * Used to mark a Service method to be called after all the Services are created, but before the server starts
 *
 * @param dependencies The dependencies that need to be initialized before this one will be
 */
export function Initializer(dependencies: unknown[] = []): PropertyDecorator {
  return (targetPrototype, propertyKey) => {
    const target = targetPrototype.constructor;
    const ready = new Deferred();

    ensureInitializer(target);

    target[INITIALIZER] = (self: Record<typeof propertyKey, () => void>) => {
      readyMap.set(target, ready.promise);

      Promise.all(dependencies.map((dep) => readyMap.get(dep)))
        .then(() => self[propertyKey as string]())
        .then(ready.resolve)
        .catch(ready.reject);
    };
  };
}

function ensureInitializer<T>(target: T): asserts target is T & { [INITIALIZER]: (self: Record<string | symbol, () => void>) => void } {
  // noop
}
