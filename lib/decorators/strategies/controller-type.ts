/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import type { FastifyInstance, FastifyReply, FastifyRequest, FastifySchema } from 'fastify';
import { onRequestHookHandler } from 'fastify/types/hooks.js';
import { CLASS_LOADER, ClassLoader, hooksRegistry, Registrable } from '../../plugins/index.js';
import { ControllerType } from '../../registry/controller-type.js';
import { ERROR_HANDLERS, HANDLERS, HOOKS } from '../../symbols/index.js';
import { transformAndWait } from '../../utils/transform-and-wait.js';
import { hasErrorHandlers, hasHandlers, hasHooks } from '../helpers/class-properties.js';
import { injectTagsIntoSwagger, TagObject } from '../helpers/swagger-helper.js';

const controllersCache = new WeakMap<FastifyRequest, unknown>();

function targetFactory(target: Registrable, classLoader: ClassLoader) {
  return async function getTarget(request: FastifyRequest) {
    if (controllersCache.has(request)) return controllersCache.get(request);
    const instance = classLoader(target, request);
    await transformAndWait(hooksRegistry.afterControllerCreation, (hook) => hook(request.server, target, instance));
    controllersCache.set(request, instance);
    return instance;
  };
}

type ControllerFactory = (fastifyInstance: FastifyInstance, target: Registrable, tags: TagObject[]) => Promise<unknown>;

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
    const instance = fastifyInstance[CLASS_LOADER](target, fastifyInstance);
    await transformAndWait(hooksRegistry.afterControllerCreation, (hook) => hook(fastifyInstance, target, instance));

    registerController(fastifyInstance, target, () => instance, tags);

    return instance;
  },

  [ControllerType.REQUEST]: async (fastifyInstance, target, tags) => {
    if (tags.length > 0) injectTagsIntoSwagger(fastifyInstance, tags);

    await transformAndWait(hooksRegistry.beforeControllerCreation, (hook) => hook(fastifyInstance, target));
    registerController(fastifyInstance, target, targetFactory(target, fastifyInstance[CLASS_LOADER]), tags);
  },
};

function registerController(fastifyInstance: FastifyInstance, target: Registrable, targetFactory: (request: FastifyRequest) => unknown, tags: TagObject[]) {
  if (hasHandlers(target)) {
    for (const handler of target[HANDLERS]) {
      const options =
        tags.length > 0 ? { ...handler.options, schema: { tags: tags.map((it) => it.name), ...handler.options.schema } as FastifySchema } : handler.options;
      fastifyInstance[handler.method](handler.url, options, async (request, ...rest) => {
        const instance = (await targetFactory(request)) as Record<string, (request: FastifyRequest, ...rest: unknown[]) => Promise<unknown>>;
        return instance[handler.handlerMethod as string](request, ...rest);
      });
    }
  }

  if (hasHooks(target)) {
    for (const hook of target[HOOKS]) {
      fastifyInstance.addHook(
        hook.name as 'onRequest',
        (async (request, ...rest): Promise<unknown> => {
          const instance = (await targetFactory(request)) as Record<string, (request: FastifyRequest, ...rest: unknown[]) => Promise<unknown>>;
          return instance[hook.handlerName as string](request, ...rest);
        }) as onRequestHookHandler,
      );
    }
  }

  if (hasErrorHandlers(target)) {
    fastifyInstance.setErrorHandler(async (error: Error, request, reply): Promise<unknown> => {
      const instance = (await targetFactory(request)) as Record<string, (error: Error, Request: FastifyRequest, reply: FastifyReply) => Promise<unknown>>;
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
