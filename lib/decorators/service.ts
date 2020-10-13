/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { injectables } from '../registry/injectables';
import { CREATOR, INITIALIZER, INJECTABLES } from '../symbols';
import { createWithInjectedDependencies } from './helpers/inject-dependencies';

/**
 * Decorator for making classes injectable
 */
export function Service(): ClassDecorator;
export function Service(injectableToken: string | symbol): ClassDecorator;
export function Service(injectableToken?: string | symbol): unknown {
    return (target: any) => {
        let instance: unknown;

        injectables.set(target, target);
        if (injectableToken) injectables.set(injectableToken, target);
        target[CREATOR] = {
            register(injectablesMap = injectables, cacheResult = true) {
                target[INJECTABLES] = injectablesMap;
                target.prototype[INJECTABLES] = injectablesMap;
                if (!cacheResult) {
                    instance = createWithInjectedDependencies(target, injectablesMap, cacheResult);
                } else {
                    if (instance) return instance;

                    instance = createWithInjectedDependencies(target, injectablesMap, cacheResult);

                }
                if (target[INITIALIZER])
                    target[INITIALIZER](instance);

                return instance;

            },
        };
    };
}
