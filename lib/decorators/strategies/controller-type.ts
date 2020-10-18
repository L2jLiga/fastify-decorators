/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import type { FastifyInstance } from 'fastify';
import type { ErrorHandler, Handler, Hook, InjectableController } from '../../interfaces';
import { ControllerType } from '../../registry';
import { ERROR_HANDLERS, HANDLERS, HOOKS } from '../../symbols';
import { hasErrorHandlers, hasHandlers, hasHooks } from '../helpers/class-properties';
import { createErrorsHandler } from '../helpers/create-errors-handler';
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
    [ControllerType.SINGLETON](instance: FastifyInstance<any, any, any, any>, constructor: InjectableController, injectablesMap: Map<any, any>, cacheResult: boolean) {
        const controllerInstance = createWithInjectedDependencies(constructor, injectablesMap, cacheResult);

        if (hasHandlers(constructor))
            registerHandlers(constructor[HANDLERS], instance, controllerInstance);
        if (hasErrorHandlers(constructor))
            registerErrorHandlers(constructor[ERROR_HANDLERS], instance, controllerInstance);
        if (hasHooks(constructor))
            registerHooks(constructor[HOOKS], instance, controllerInstance);
    },

    [ControllerType.REQUEST](instance: FastifyInstance<any, any, any, any>, constructor: InjectableController, injectablesMap: Map<any, any>, cacheResult: boolean) {
        if (hasHandlers(constructor))
            constructor[HANDLERS].forEach(handler => {
                const { url, method, handlerMethod, options } = handler;

                instance[method](url, options, function (...args) {
                    return createWithInjectedDependencies(constructor, injectablesMap, cacheResult)[handlerMethod](...args);
                });
            });
    },
} as const;

function registerHandlers(handlers: Handler[], instance: FastifyInstance, controllerInstance: any): void {
    handlers.forEach(handler => {
        instance[handler.method](handler.url, handler.options, controllerInstance[handler.handlerMethod].bind(controllerInstance));
    });
}

function registerHooks(hooks: Hook[], instance: FastifyInstance, controllerInstance: any): void {
    hooks.forEach(hook => {
        instance.addHook(hook.name, controllerInstance[hook.handlerName].bind(controllerInstance));
    });
}

function registerErrorHandlers(errorHandlers: ErrorHandler[], instance: FastifyInstance, classInstance: any) {
    instance.setErrorHandler(createErrorsHandler(errorHandlers, classInstance));
}
