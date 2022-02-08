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
  return (targetPrototype: any, propertyKey: string | symbol) => {
    const target = targetPrototype.constructor;
    const ready = new Deferred();

    target[INITIALIZER] = (self: Record<typeof propertyKey, () => void>) => {
      Promise.all(dependencies.map((dep) => readyMap.get(dep)))
        .then(() => self[propertyKey as string]())
        .then(ready.resolve)
        .catch(ready.reject);
    };

    readyMap.set(target, ready.promise);
  };
}
