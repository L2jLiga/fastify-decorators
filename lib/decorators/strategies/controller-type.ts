/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import type { IErrorHandler, IHandler, IHook, InjectableController } from '../../interfaces/index.js';
import type { Injectables } from '../../interfaces/injectable-class.js';
import { ControllerType } from '../../registry/controller-type.js';
import { ERROR_HANDLERS, HANDLERS, HOOKS } from '../../symbols/index.js';
import { hasErrorHandlers, hasHandlers, hasHooks } from '../helpers/class-properties.js';
import { createErrorsHandler } from '../helpers/create-errors-handler.js';
import { createWithInjectedDependencies } from '../helpers/inject-dependencies.js';

const controllersCache = new WeakMap<FastifyRequest, unknown>();

function targetFactory(constructor: InjectableController, injectablesMap: Injectables, cacheResult: boolean) {
  return function getTarget(request: FastifyRequest) {
    if (controllersCache.has(request)) return controllersCache.get(request);
    const target = createWithInjectedDependencies(constructor, injectablesMap, cacheResult);
    controllersCache.set(request, target);
    return target;
  };
}

type ControllerFactory = (instance: FastifyInstance, constructor: InjectableController, injectablesMap: Injectables, cacheResult: boolean) => unknown;

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
export const ControllerTypeStrategies: Record<ControllerType, ControllerFactory> = {
  [ControllerType.SINGLETON](instance, constructor, injectablesMap, cacheResult) {
    const controllerInstance = createWithInjectedDependencies(constructor, injectablesMap, cacheResult);

    if (hasHandlers(constructor)) registerHandlers(constructor[HANDLERS], instance, controllerInstance);
    if (hasErrorHandlers(constructor)) registerErrorHandlers(constructor[ERROR_HANDLERS], instance, controllerInstance);
    if (hasHooks(constructor)) registerHooks(constructor[HOOKS], instance, controllerInstance);

    return controllerInstance;
  },

  [ControllerType.REQUEST](instance, constructor, injectablesMap, cacheResult) {
    const getTarget = targetFactory(constructor, injectablesMap, cacheResult);

    if (hasHandlers(constructor))
      constructor[HANDLERS].forEach((handler) => {
        const { url, method, handlerMethod, options } = handler;

        instance[method](url, options, function (request, ...args) {
          return getTarget(request)[handlerMethod](request, ...args);
        });
      });

    if (hasErrorHandlers(constructor))
      instance.setErrorHandler((error, request, ...rest) => {
        const errorsHandler = createErrorsHandler(constructor[ERROR_HANDLERS], getTarget(request));

        return errorsHandler(error, request, ...rest);
      });

    if (hasHooks(constructor))
      constructor[HOOKS].forEach((hook) =>
        instance.addHook(hook.name as 'onRequest', (request: FastifyRequest, ...rest: unknown[]) => {
          return getTarget(request)[hook.handlerName](request, ...rest);
        }),
      );
  },
};

function registerHandlers(
  handlers: IHandler[],
  instance: FastifyInstance,
  controllerInstance: Record<string, (request: FastifyRequest, reply: FastifyReply) => void>,
): void {
  handlers.forEach((handler) => {
    instance[handler.method](handler.url, handler.options, controllerInstance[handler.handlerMethod as string].bind(controllerInstance));
  });
}

function registerHooks(
  hooks: IHook[],
  instance: FastifyInstance,
  controllerInstance: Record<string, (request: FastifyRequest, reply: FastifyReply) => void>,
): void {
  hooks.forEach((hook) => {
    instance.addHook(hook.name as 'onRequest', controllerInstance[hook.handlerName as string].bind(controllerInstance));
  });
}

function registerErrorHandlers(
  errorHandlers: IErrorHandler[],
  instance: FastifyInstance,
  classInstance: Record<string, (error: Error, request: FastifyRequest, reply: FastifyReply) => void>,
) {
  instance.setErrorHandler(createErrorsHandler(errorHandlers, classInstance));
}
