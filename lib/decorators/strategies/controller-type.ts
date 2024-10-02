import type { FastifyInstance, FastifyReply, FastifyRequest, FastifySchema, RouteHandlerMethod } from 'fastify';
import { onRequestHookHandler } from 'fastify/types/hooks.js';
import { transformAndWait } from '../../utils/transform-and-wait.js';
import { injectTagsIntoSwagger, TagObject } from '../helpers/swagger-helper.js';
import { hooksRegistry } from '../../registry/hooks-registry.js';
import { CLASS_LOADER, ClassLoader } from '../../plugins/class-loader.js';
import { Scope } from '../../constants/scope.js';
import { getContainer } from '../../utils/container-utils.js';
import { ERROR_HANDLER, HOOK, REQUEST_HANDLER } from '../../constants/symbols.js';

const controllersCache = new WeakMap<FastifyRequest, unknown>();

function targetFactory(target: object, classLoader: ClassLoader) {
  return async function getTarget(request: FastifyRequest) {
    if (controllersCache.has(request)) return controllersCache.get(request);
    const instance = classLoader(target, request);
    await transformAndWait(hooksRegistry.afterControllerCreation, (hook) => hook(request.server, target, instance));
    controllersCache.set(request, instance);
    return instance;
  };
}

function requestHandlerFactory(target: object) {
  return async function getTarget(request: FastifyRequest, ...args: unknown[]) {
    if (controllersCache.has(request)) return controllersCache.get(request);
    // @ts-expect-error FIXME: not valid, does not work with class loader
    const instance = new target(request, ...args);
    await transformAndWait(hooksRegistry.afterControllerCreation, (hook) => hook(request.server, target, instance));
    controllersCache.set(request, instance);
    return instance;
  };
}

type ControllerFactory = (fastifyInstance: FastifyInstance, target: object, metadata: Record<PropertyKey, unknown>, tags: TagObject[]) => Promise<unknown>;

/**
 * Various strategies which can be applied to controller
 *
 * @remarks
 *
 * There are few available strategies:
 * - *SINGLETON* strategy creates one instance of controller which will handle all requests
 * - *PER_REQUEST* strategy will create new instance for each request/hook
 *
 * By default, controllers use *SINGLETON* strategy
 *
 * @see Controller
 * @see ControllerConfig
 */
export const ControllerTypeStrategies: Record<Scope | 'RequestHandler', ControllerFactory> = {
  [Scope.SINGLETON]: async (fastifyInstance, target, metadata, tags) => {
    if (tags.length > 0) injectTagsIntoSwagger(fastifyInstance, tags);

    await transformAndWait(hooksRegistry.beforeControllerCreation, (hook) => hook(fastifyInstance, target));
    const instance = fastifyInstance[CLASS_LOADER](target, fastifyInstance);
    await transformAndWait(hooksRegistry.afterControllerCreation, (hook) => hook(fastifyInstance, target, instance));

    registerController(fastifyInstance, metadata, () => instance, tags);

    return instance;
  },

  [Scope.PER_REQUEST]: async (fastifyInstance, target, metadata, tags) => {
    if (tags.length > 0) injectTagsIntoSwagger(fastifyInstance, tags);

    await transformAndWait(hooksRegistry.beforeControllerCreation, (hook) => hook(fastifyInstance, target));
    registerController(fastifyInstance, metadata, targetFactory(target, fastifyInstance[CLASS_LOADER]), tags);
  },

  // FIXME: not perfect, but working solution
  ['RequestHandler']: async (fastifyInstance, target, metadata, tags) => {
    if (tags.length > 0) injectTagsIntoSwagger(fastifyInstance, tags);

    await transformAndWait(hooksRegistry.beforeControllerCreation, (hook) => hook(fastifyInstance, target));
    registerController(fastifyInstance, metadata, requestHandlerFactory(target), tags);
  },
};

function inheritParentMetadata(metadata: Record<PropertyKey, unknown>): void {
  const parent = Object.getPrototypeOf(metadata);
  if (!parent) return;

  if (Object.getPrototypeOf(parent)) {
    inheritParentMetadata(parent);
  }

  for (const key of [HOOK, REQUEST_HANDLER, ERROR_HANDLER]) {
    getContainer(metadata, key).setParent(getContainer(parent, key));
  }
}

function registerController(
  fastifyInstance: FastifyInstance,
  metadata: Record<PropertyKey, unknown>,
  targetFactory: (request: FastifyRequest, ...rest: unknown[]) => unknown,
  tags: TagObject[],
) {
  inheritParentMetadata(metadata);

  for (const handler of getContainer(metadata, REQUEST_HANDLER)) {
    const options =
      tags.length > 0 ? { ...handler.options, schema: { tags: tags.map((it) => it.name), ...handler.options.schema } as FastifySchema } : handler.options;
    const requestHandler: RouteHandlerMethod = async (request, ...rest) => {
      const instance = (await targetFactory(request, ...rest)) as Record<string, (request: FastifyRequest, ...rest: unknown[]) => Promise<unknown>>;
      return instance[handler.handlerName as string](request, ...rest);
    };

    if (handler.method === 'all') {
      fastifyInstance[handler.method](handler.url, options, requestHandler);
    } else {
      fastifyInstance.route({
        ...options,
        url: handler.url,
        method: handler.method,
        handler: requestHandler,
      });
    }
  }

  for (const hook of getContainer(metadata, HOOK)) {
    fastifyInstance.addHook(
      hook.name as 'onRequest',
      (async (request, ...rest): Promise<unknown> => {
        const instance = (await targetFactory(request, ...rest)) as Record<string, (request: FastifyRequest, ...rest: unknown[]) => Promise<unknown>>;
        return instance[hook.handlerName as string](request, ...rest);
      }) as onRequestHookHandler,
    );
  }

  const errorHandlers = getContainer(metadata, ERROR_HANDLER);
  if (errorHandlers.length > 0) {
    fastifyInstance.setErrorHandler(async (error: Error, request, reply, ...rest): Promise<unknown> => {
      const instance = (await targetFactory(request, reply, ...rest)) as Record<
        string,
        (error: Error, Request: FastifyRequest, reply: FastifyReply) => Promise<unknown>
      >;
      for (const handler of errorHandlers) {
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
