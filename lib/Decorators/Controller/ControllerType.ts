import type { FastifyInstance, FastifyReply, FastifyRequest, FastifySchema } from 'fastify';
import { ClassLoader } from '../../Interfaces/index.js';
import type { IErrorHandler, IHandler, IHook, InjectableController } from '../../Interfaces/index.js';
import { ERROR_HANDLERS, HANDLERS, HOOKS } from '../../Symbols/index.js';
import { SwaggerHelper, ClassPropsHelper, ErrorHandlerHelper } from '../Helpers/index.js';
import { ControllerConfig } from './Controller.js';
import LifecycleHook from './LifecycleHook.js';

type ControllerFactory = (
  fastify: FastifyInstance,
  constructor: InjectableController,
  classLoader: ClassLoader,
  config?: Partial<ControllerConfig>,
) => InjectableController | undefined;

//type ControllerInstance=InstanceType<InjectableController>;

export enum ControllerType {
  /**
   * Controller will use SINGLETON strategy
   */
  SINGLETON,

  /**
   * Controller will use REQUEST strategy
   */
  REQUEST,
}

export type ControllerTypeLiteral = 'singleton' | 'perRequest';

export const toControllerType = (value: any): ControllerType => {
  if (typeof value === 'string') {
    switch (value) {
      case 'perRequest':
        return ControllerType.REQUEST;
      case 'singleton':
      default:
        return ControllerType.SINGLETON;
    }
  } else if (Object.values(ControllerType).includes(value)) return value;
  else return ControllerType.SINGLETON;
};

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
  [ControllerType.SINGLETON](fastify, constructor, classLoader, config) {
    const { tags, hooks } = config ?? {};
    const controllerInstance = classLoader(constructor);
    if (Array.isArray(hooks) && hooks.length) {
      registerLifecycleHooks(fastify, {
        route: config?.route || '',
        lifecycleHooks: hooks,
      });
    }
    const withTags = Array.isArray(tags) && tags.length;
    if (withTags) SwaggerHelper.injectTags(fastify, tags);

    if (ClassPropsHelper.hasHandlers(constructor)) {
      registerHandlers(constructor[HANDLERS], fastify, controllerInstance, withTags ? tags : []);
    }
    if (ClassPropsHelper.hasErrorHandlers(constructor)) {
      registerErrorHandlers(constructor[ERROR_HANDLERS], fastify, controllerInstance);
    }
    if (ClassPropsHelper.hasHooks(constructor)) {
      registerHooks(constructor[HOOKS], fastify, controllerInstance);
    }

    return controllerInstance;
  },

  [ControllerType.REQUEST](fastify, constructor, classLoader, config) {
    const { tags, hooks } = config ?? {};

    const withTags = Array.isArray(tags) && tags.length;
    if (withTags) SwaggerHelper.injectTags(fastify, tags);

    if (Array.isArray(hooks) && hooks.length) {
      registerLifecycleHooks(fastify, {
        route: config?.route || '',
        lifecycleHooks: hooks,
      });
    }

    const getTarget = targetFactory(constructor, classLoader);
    if (ClassPropsHelper.hasHandlers(constructor)) {
      for (const handler of constructor[HANDLERS]) {
        const { url, method, handlerMethod, options } = handler;
        fastify[method](
          url,
          withTags
            ? {
                ...options,
                schema: {
                  tags: tags.map((tag) => tag.name),
                  ...options.schema,
                } as FastifySchema,
              }
            : options,
          (request, ...args) => getTarget(request)[handlerMethod](request, ...args),
        );
      }
    }

    if (ClassPropsHelper.hasErrorHandlers(constructor)) {
      fastify.setErrorHandler((error: Error, request, ...rest) => {
        const errorHandler = ErrorHandlerHelper.create(constructor[ERROR_HANDLERS], getTarget(request));

        return errorHandler(error, request, ...rest);
      });
    }

    if (ClassPropsHelper.hasHooks(constructor)) {
      for (const hook of constructor[HOOKS]) {
        fastify.addHook(hook.name as 'onRequest', (request: FastifyRequest, ...rest: unknown[]) => {
          return getTarget(request)[hook.handlerName](request, ...rest);
        });
      }
    }
  },
};

const targetFactory = (constructor: InjectableController, classLoader: ClassLoader) => {
  return (request: FastifyRequest) => classLoader(constructor, request);
};

function registerHandlers(
  handlers: Iterable<IHandler>,
  fastify: FastifyInstance,
  controllerInstance: Record<string, (request: FastifyRequest, reply: FastifyReply) => void>,
  tags: SwaggerHelper.TagObject[],
): void {
  for (const handler of handlers) {
    fastify[handler.method](
      handler.url,
      tags.length > 0 ? { ...handler.options, schema: { tags: tags.map((it) => it.name), ...handler.options.schema } as FastifySchema } : handler.options,
      (...args) => controllerInstance[handler.handlerMethod as string](...args),
    );
  }
}

function registerHooks(
  hooks: Iterable<IHook>,
  fastify: FastifyInstance,
  controllerInstance: Record<string, (request: FastifyRequest, reply: FastifyReply) => void>,
): void {
  for (const hook of hooks) {
    fastify.addHook(hook.name as 'onRequest', controllerInstance[hook.handlerName as string].bind(controllerInstance));
  }
}

function registerErrorHandlers(
  errorHandlers: Iterable<IErrorHandler>,
  fastify: FastifyInstance,
  classInstance: Record<string, (error: Error, request: FastifyRequest, reply: FastifyReply) => void>,
) {
  fastify.setErrorHandler(ErrorHandlerHelper.create(errorHandlers, classInstance));
}

const registerLifecycleHooks = (
  fastify: FastifyInstance,
  config: {
    route: string;
    lifecycleHooks: Array<LifecycleHook>;
  },
) => {
  /**
   * TODO:
   * this will register an onRoute hook for every controller.
   * Better to register a single onRoute hook and register
   * all controller's lifecycleHooks there.
   */
  const { route, lifecycleHooks } = config;
  fastify.addHook('onRoute', (options) => {
    const { url } = options;
    if (url.startsWith(route))
      try {
        LifecycleHook.registerAll(lifecycleHooks, options);
      } catch (error) {
        throw new Error(`Controller ${route} at ${options.routePath}: ${(error as Error).message}`);
      }
  });
};
