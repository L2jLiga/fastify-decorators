/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import type { FastifyInstance, FastifyReply, FastifyRequest, FastifySchema } from 'fastify';
import { ClassLoader } from '../../interfaces/bootstrap-config.js';
import type { IErrorHandler, IHandler, IHook, InjectableController } from '../../interfaces/index.js';
import { ControllerType } from '../../registry/controller-type.js';
import { ERROR_HANDLERS, HANDLERS, HOOKS } from '../../symbols/index.js';
import { hasErrorHandlers, hasHandlers, hasHooks } from '../helpers/class-properties.js';
import { createErrorsHandler } from '../helpers/create-errors-handler.js';
import { injectTagsIntoSwagger, TagObject } from '../helpers/swagger-helper.js';

function targetFactory(constructor: InjectableController, classLoader: ClassLoader) {
  return function getTarget(request: FastifyRequest) {
    return classLoader(constructor, request);
  };
}

type ControllerFactory = (instance: FastifyInstance, constructor: InjectableController, classLoader: ClassLoader, tags: TagObject[]) => unknown;

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
  [ControllerType.SINGLETON](instance, constructor, classLoader, tags) {
    if (tags.length > 0) injectTagsIntoSwagger(instance, tags);

    const controllerInstance = classLoader(constructor);

    if (hasHandlers(constructor)) registerHandlers(constructor[HANDLERS], instance, controllerInstance, tags);
    if (hasErrorHandlers(constructor)) registerErrorHandlers(constructor[ERROR_HANDLERS], instance, controllerInstance);
    if (hasHooks(constructor)) registerHooks(constructor[HOOKS], instance, controllerInstance);

    return controllerInstance;
  },

  [ControllerType.REQUEST](instance, constructor, classLoader, tags) {
    if (tags.length > 0) injectTagsIntoSwagger(instance, tags);

    const getTarget = targetFactory(constructor, classLoader);

    if (hasHandlers(constructor))
      for (const handler of constructor[HANDLERS]) {
        const { url, method, handlerMethod, options } = handler;

        instance[method](
          url,
          tags.length > 0 ? { ...options, schema: { tags: tags.map((tag) => tag.name), ...options.schema } as FastifySchema } : options,
          function (request, ...args) {
            return getTarget(request)[handlerMethod](request, ...args);
          },
        );
      }

    if (hasErrorHandlers(constructor))
      instance.setErrorHandler((error, request, ...rest) => {
        const errorsHandler = createErrorsHandler(constructor[ERROR_HANDLERS], getTarget(request));

        return errorsHandler(error, request, ...rest);
      });

    if (hasHooks(constructor))
      for (const hook of constructor[HOOKS]) {
        instance.addHook(hook.name as 'onRequest', (request: FastifyRequest, ...rest: unknown[]) => {
          return getTarget(request)[hook.handlerName](request, ...rest);
        });
      }
  },
};

function registerHandlers(
  handlers: Iterable<IHandler>,
  instance: FastifyInstance,
  controllerInstance: Record<string, (request: FastifyRequest, reply: FastifyReply) => void>,
  tags: TagObject[],
): void {
  for (const handler of handlers) {
    instance[handler.method](
      handler.url,
      tags.length > 0 ? { ...handler.options, schema: { tags: tags.map((it) => it.name), ...handler.options.schema } as FastifySchema } : handler.options,
      (...args) => controllerInstance[handler.handlerMethod as string](...args),
    );
  }
}

function registerHooks(
  hooks: Iterable<IHook>,
  instance: FastifyInstance,
  controllerInstance: Record<string, (request: FastifyRequest, reply: FastifyReply) => void>,
): void {
  for (const hook of hooks) {
    instance.addHook(hook.name as 'onRequest', controllerInstance[hook.handlerName as string].bind(controllerInstance));
  }
}

function registerErrorHandlers(
  errorHandlers: Iterable<IErrorHandler>,
  instance: FastifyInstance,
  classInstance: Record<string, (error: Error, request: FastifyRequest, reply: FastifyReply) => void>,
) {
  instance.setErrorHandler(createErrorsHandler(errorHandlers, classInstance));
}
