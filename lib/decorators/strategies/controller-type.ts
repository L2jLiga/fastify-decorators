/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { FastifyInstance } from 'fastify';
import { AbstractController, ControllerConstructor } from '../../interfaces';
import { ControllerType } from '../../registry';
import { CREATOR } from '../../symbols';

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
    [ControllerType.SINGLETON](instance: FastifyInstance, constructor: ControllerConstructor) {
        const controllerInstance = createInstance(instance, constructor);

        const configuration = constructor[CREATOR];

        configuration.handlers.forEach(handler => {
            instance[handler.method](handler.url, handler.options, (request, reply) => controllerInstance[handler.handlerMethod](request, reply));
        });

        configuration.hooks.forEach(hook => {
            instance.addHook(hook.name, controllerInstance[hook.handlerName].bind(controllerInstance));
        });
    },

    [ControllerType.REQUEST](instance: FastifyInstance, constructor: ControllerConstructor) {
        const configuration = constructor[CREATOR];

        configuration.handlers.forEach(handler => {
            const { url, method, handlerMethod, options } = handler;

            instance[method](url, options, (request, reply) => createInstance(instance, constructor)[handlerMethod](request, reply));
        });

        configuration.hooks.forEach(hook => {
            instance.addHook(hook.name, (...args) => createInstance(instance, constructor)[hook.handlerName](...args));
        });
    }
};

/**
 * Creates controller instance
 */
function createInstance(instance: FastifyInstance, controllerConstructor: ControllerConstructor) {
    const controllerInstance = new controllerConstructor;

    if (controllerInstance instanceof AbstractController) {
        controllerInstance.instance = instance;
    }

    return controllerInstance;
}
