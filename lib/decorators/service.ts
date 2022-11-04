/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { ClassLoader } from '../interfaces/bootstrap-config.js';
import { InjectableService } from '../interfaces/injectable-class.js';
import { destructors } from '../registry/destructors.js';
import { injectables } from '../registry/injectables.js';
import { CREATOR, DESTRUCTOR, INITIALIZER } from '../symbols/index.js';

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
      register<Type>(classLoader: ClassLoader): Type {
        instance = classLoader<Type>(target);

        target[INITIALIZER]?.(instance);
        if (target[DESTRUCTOR]) destructors.set(target, target[DESTRUCTOR]);

        return instance as Type;
      },
    };
  };
}
