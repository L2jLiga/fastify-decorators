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
import { INITIALIZER } from '../symbols.js';
import { createWithConstructorDependencies, injectDependenciesIntoInstance, patchConstructable } from './helpers/inject-dependencies.js';
import { patchMethods } from './helpers/patch-methods.js';

/**
 * Set of hooks to patch controllers in order to support DI
 */
createInitializationHook('beforeControllerCreation', (fastifyInstance, target) => patchMethods(target));
createInitializationHook('beforeControllerCreation', (fastifyInstance, target) => patchConstructable(target, injectables, true));
createInitializationHook('afterControllerCreation', (fastifyInstance, target, instance) => {
  injectDependenciesIntoInstance(instance, target, injectables, true);
});

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
        if (instance && cacheResult) return instance as Type;
        patchConstructable(target, injectablesMap, cacheResult);
        instance = createWithConstructorDependencies<Type>(target, injectablesMap, cacheResult);
        injectDependenciesIntoInstance(instance, target, injectablesMap, cacheResult);

        target[INITIALIZER]?.(instance);

        return instance as Type;
      },
    };
  };
}
