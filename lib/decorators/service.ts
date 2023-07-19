/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { ClassLoader } from '../interfaces/bootstrap-config.js';
import { InjectableService } from '../interfaces/injectable-class.js';
import { _injectablesHolder } from '../registry/_injectables-holder.js';
import { destructors } from '../registry/destructors.js';
import { CREATOR, DESTRUCTOR, INITIALIZED, INITIALIZER } from '../symbols/index.js';
import { Deferred } from '../utils/deferred.js';
import { readyMap } from './initializer.js';

/**
 * Decorator for making classes injectable
 */
export function Service(): ClassDecorator;
export function Service(injectableToken: string | symbol): ClassDecorator;
export function Service(injectableToken?: string | symbol): unknown {
  return (target: InjectableService) => {
    target[CREATOR] = {
      register<Type>(classLoader: ClassLoader): Type {
        const instance = classLoader<Type & { [INITIALIZED]?: Promise<unknown> }>(target);
        if (instance[INITIALIZED]) return instance as Type;

        const deferred = new Deferred();
        instance[INITIALIZED] = deferred.promise;
        readyMap.set(instance, deferred.promise);

        Promise.resolve(target[INITIALIZER]?.(instance))
          .then(() => deferred.resolve())
          .catch(deferred.reject);

        if (target[DESTRUCTOR]) destructors.set(target, target[DESTRUCTOR]);

        return instance as Type;
      },
    };

    _injectablesHolder.injectService(target, target, false);
    if (injectableToken) _injectablesHolder.injectService(injectableToken, target, false);
  };
}
