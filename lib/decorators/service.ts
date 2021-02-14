/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { InjectableService } from '../interfaces/injectable-class.js';
import { injectables } from '../registry/injectables.js';
import { CREATOR, INITIALIZER, INJECTABLES } from '../symbols/index.js';
import { createWithInjectedDependencies } from './helpers/inject-dependencies.js';

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
