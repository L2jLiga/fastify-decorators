/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import type { FastifyInstance, FastifyRequest, FastifySchema } from 'fastify';
import { hooksRegistry, Registrable } from '../../plugins/index.js';
import { ControllerType } from '../../registry/controller-type.js';
import { ERROR_HANDLERS, HANDLERS, HOOKS } from '../../symbols/index.js';
import { transformAndWait } from '../../utils/transform-and-wait.js';
import { hasErrorHandlers, hasHandlers, hasHooks } from '../helpers/class-properties.js';
import { injectTagsIntoSwagger, TagObject } from '../helpers/swagger-helper.js';

const controllersCache = new WeakMap<FastifyRequest, unknown>();

function targetFactory(target: Registrable) {
  return async function getTarget(request: FastifyRequest) {
    if (controllersCache.has(request)) return controllersCache.get(request);
    const instance = new target();
    await transformAndWait(hooksRegistry.afterControllerCreation, (hook) => hook(request.server, target, instance));
    controllersCache.set(request, instance);
    return instance;
  };
}

type ControllerFactory = (fastifyInstance: FastifyInstance, target: Registrable, tags: TagObject[]) => unknown;

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
  [ControllerType.SINGLETON]: async (fastifyInstance, target, tags) => {
    if (tags.length > 0) injectTagsIntoSwagger(fastifyInstance, tags);

    await transformAndWait(hooksRegistry.beforeControllerCreation, (hook) => hook(fastifyInstance, target));
    const instance = new target();
    await transformAndWait(hooksRegistry.afterControllerCreation, (hook) => hook(fastifyInstance, target, instance));

    registerController(fastifyInstance, target, () => instance, tags);

    return instance;
  },

  [ControllerType.REQUEST]: async (fastifyInstance, target, tags) => {
    if (tags.length > 0) injectTagsIntoSwagger(fastifyInstance, tags);

    await transformAndWait(hooksRegistry.beforeControllerCreation, (hook) => hook(fastifyInstance, target));
    registerController(fastifyInstance, target, targetFactory(target), tags);
  },
};

function registerController(fastifyInstance: FastifyInstance, target: Registrable, targetFactory: (request: FastifyRequest) => any, tags: TagObject[]) {
  if (hasHandlers(target)) {
    for (const handler of target[HANDLERS]) {
      const options =
        tags.length > 0 ? { ...handler.options, schema: { tags: tags.map((it) => it.name), ...handler.options.schema } as FastifySchema } : handler.options;
      fastifyInstance[handler.method](handler.url, options, async (request, ...rest) => {
        const instance = await targetFactory(request);
        return instance[handler.handlerMethod](request, ...rest);
      });
    }
  }

  if (hasHooks(target)) {
    for (const hook of target[HOOKS]) {
      fastifyInstance.addHook(hook.name as 'onRequest', async (request, ...rest) => {
        const instance = await targetFactory(request);
        return instance[hook.handlerName](request, ...rest);
      });
    }
  }

  if (hasErrorHandlers(target)) {
    fastifyInstance.setErrorHandler(async (error: Error, request, reply) => {
      const instance = await targetFactory(request);
      for (const handler of target[ERROR_HANDLERS]) {
        if (handler.accepts(error)) {
          try {
            await instance[handler.handlerName as string](error, request, reply);
            return;
          } catch (e) {
            error = e as Error;
          }
        }
      }

      throw error;
    });
  }
}
