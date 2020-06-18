/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { FastifyInstance } from 'fastify';
import { ControllerConstructor } from '../../interfaces';
import { ControllerType } from '../../registry';
import { CREATOR } from '../../symbols';
import { createWithInjectedDependencies } from '../helpers/inject-dependencies';

/**
 * Various strategies which can be applied to controller
 *
 * @usageNotes
 *
 * There are few available strategies:
 *   SINGLETON strategy creates one instance of controller which will handle all requests
 *   REQUEST strategy will create new instance for each request/hook
 *
 * By default controllers use SINGLETON strategy
 */
export const ControllerTypeStrategies = {
    [ControllerType.SINGLETON](instance: FastifyInstance<any, any, any, any>, constructor: ControllerConstructor, injectablesMap: Map<any, any>, cacheResult: boolean) {
        const controllerInstance = createWithInjectedDependencies(constructor, injectablesMap, cacheResult);

        const configuration = constructor[CREATOR];

        configuration.handlers.forEach(handler => {
            instance[handler.method](handler.url, handler.options, function (...args) {
                return controllerInstance[handler.handlerMethod](...args);
            });
        });

        configuration.hooks.forEach(hook => {
            instance.addHook(hook.name, controllerInstance[hook.handlerName].bind(controllerInstance));
        });
    },

    [ControllerType.REQUEST](instance: FastifyInstance<any, any, any, any>, constructor: ControllerConstructor, injectablesMap: Map<any, any>, cacheResult: boolean) {
        const configuration = constructor[CREATOR];

        configuration.handlers.forEach(handler => {
            const { url, method, handlerMethod, options } = handler;

            instance[method](url, options, function (...args) {
                return createWithInjectedDependencies(constructor, injectablesMap, cacheResult)[handlerMethod](...args);
            });
        });
    },
} as const;
