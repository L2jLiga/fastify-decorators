/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { createInitializationHook, CREATOR } from 'fastify-decorators/plugins';
import { InjectableService } from '../interfaces/injectable-class.js';
import { injectables } from '../registry/injectables.js';
import { INITIALIZER, INJECTABLES } from '../symbols.js';
import { createWithInjectedDependencies } from './helpers/inject-dependencies.js';
import { patchMethods } from './helpers/patch-methods.js';

createInitializationHook('beforeControllerCreation', (target) => patchMethods(target));

createInitializationHook('afterControllerCreation', (instance, Registrable) =>
  Object.assign(instance as any, createWithInjectedDependencies(Registrable, injectables, true)),
);

/**
 * Decorator for making classes injectable
 */
export function Service(): ClassDecorator;
export function Service(injectableToken: string | symbol): ClassDecorator;
export function Service(injectableToken?: string | symbol): unknown {
  return (target: InjectableService) => {
    let instance: unknown;

    injectables.set(target, target);
    if (injectableToken) injectables.set(injectableToken, target);
    target[CREATOR] = {
      register<Type>(injectablesMap = injectables, cacheResult = true): Type {
        target[INJECTABLES] = injectablesMap;
        target.prototype[INJECTABLES] = injectablesMap;

        if (instance && cacheResult) return instance as Type;
        instance = createWithInjectedDependencies<Type>(target, injectablesMap, cacheResult);

        target[INITIALIZER]?.(instance);

        return instance as Type;
      },
    };
  };
}
