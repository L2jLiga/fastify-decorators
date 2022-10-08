/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import type { FastifyInstance, FastifyReply, FastifyRequest, FastifySchema } from 'fastify';
import type { IErrorHandler, IHandler, IHook } from '../../interfaces/index.js';
import { hooksRegistry } from '../../plugins/life-cycle.js';
import { Registrable } from '../../plugins/shared-interfaces.js';
import { ControllerType } from '../../registry/controller-type.js';
import { ERROR_HANDLERS, HANDLERS, HOOKS } from '../../symbols/index.js';
import { transformAndWait } from '../../utils/transform-and-wait.js';
import { hasErrorHandlers, hasHandlers, hasHooks } from '../helpers/class-properties.js';
import { createErrorsHandler } from '../helpers/create-errors-handler.js';
import { injectTagsIntoSwagger, TagObject } from '../helpers/swagger-helper.js';

const controllersCache = new WeakMap<FastifyRequest, unknown>();

function targetFactory(constructor: Registrable) {
  return async function getTarget(request: FastifyRequest) {
    if (controllersCache.has(request)) return controllersCache.get(request);
    const target = new constructor();
    await transformAndWait(hooksRegistry.afterControllerCreation, (hook) => hook(request.server, constructor, target));
    controllersCache.set(request, target);
    return target;
  };
}

type ControllerFactory = (instance: FastifyInstance, constructor: Registrable, tags: TagObject[]) => unknown;

/**
 * Various strategies which can be applied to controller
 *
 * @usageNotes
 *
 * There are few available strategies:
 * - *SINGLETON* strategy creates one instance of controller which will handle all requests
 * - *REQUEST* strategy will create new instance for each request/hook
 *
 * By default, controllers use *SINGLETON* strategy
 *
 * @see Controller
 * @see ControllerConfig
 */
export const ControllerTypeStrategies: Record<ControllerType, ControllerFactory> = {
  [ControllerType.SINGLETON]: async (instance, constructor, tags) => {
    if (tags.length > 0) injectTagsIntoSwagger(instance, tags);

    await transformAndWait(hooksRegistry.beforeControllerCreation, (hook) => hook(instance, constructor));
    const controllerInstance = new constructor();
    await transformAndWait(hooksRegistry.afterControllerCreation, (hook) => hook(instance, constructor, controllerInstance));

    if (hasHandlers(constructor)) registerHandlers(constructor[HANDLERS], instance, controllerInstance, tags);
    if (hasErrorHandlers(constructor)) registerErrorHandlers(constructor[ERROR_HANDLERS], instance, controllerInstance);
    if (hasHooks(constructor)) registerHooks(constructor[HOOKS], instance, controllerInstance);

    return controllerInstance;
  },

  [ControllerType.REQUEST]: async (instance, constructor, tags) => {
    if (tags.length > 0) injectTagsIntoSwagger(instance, tags);

    await transformAndWait(hooksRegistry.beforeControllerCreation, (hook) => hook(instance, constructor));
    const factory = targetFactory(constructor);

    if (hasHandlers(constructor))
      constructor[HANDLERS].forEach((handler) => {
        const { url, method, handlerMethod, options } = handler;

        instance[method](
          url,
          tags.length > 0 ? { ...options, schema: { tags: tags.map((tag) => tag.name), ...options.schema } as FastifySchema } : options,
          async function (request, ...args) {
            const controllerInstance = await factory(request);
            return controllerInstance[handlerMethod](request, ...args);
          },
        );
      });

    if (hasErrorHandlers(constructor))
      instance.setErrorHandler(async (error, request, ...rest) => {
        const controllerInstance = await factory(request);
        const errorsHandler = createErrorsHandler(constructor[ERROR_HANDLERS], controllerInstance);

        return errorsHandler(error, request, ...rest);
      });

    if (hasHooks(constructor))
      constructor[HOOKS].forEach((hook) =>
        instance.addHook(hook.name as 'onRequest', async (request: FastifyRequest, ...rest: unknown[]) => {
          const controllerInstance = await factory(request);
          return controllerInstance[hook.handlerName](request, ...rest);
        }),
      );
  },
};

function registerHandlers(
  handlers: IHandler[],
  instance: FastifyInstance,
  controllerInstance: Record<string, (request: FastifyRequest, reply: FastifyReply) => void>,
  tags: TagObject[],
): void {
  handlers.forEach((handler) => {
    instance[handler.method](
      handler.url,
      tags.length > 0 ? { ...handler.options, schema: { tags: tags.map((it) => it.name), ...handler.options.schema } as FastifySchema } : handler.options,
      (...args) => controllerInstance[handler.handlerMethod as string](...args),
    );
  });
}

function registerHooks(
  hooks: IHook[],
  instance: FastifyInstance,
  controllerInstance: Record<string, (request: FastifyRequest, reply: FastifyReply, done: unknown) => void>,
): void {
  hooks.forEach((hook) => {
    instance.addHook(hook.name as 'onRequest', (...args) => controllerInstance[hook.handlerName as string](...args));
  });
}

function registerErrorHandlers(
  errorHandlers: IErrorHandler[],
  instance: FastifyInstance,
  classInstance: Record<string, (error: Error, request: FastifyRequest, reply: FastifyReply) => void>,
) {
  instance.setErrorHandler(createErrorsHandler(errorHandlers, classInstance));
}
