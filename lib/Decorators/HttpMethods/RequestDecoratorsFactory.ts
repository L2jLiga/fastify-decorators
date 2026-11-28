import type { FastifyInstance, FastifyRequest, RouteShorthandOptions } from 'fastify';
import { HttpMethod } from '../../Interfaces/index.js';
import { RequestHandler, RequestHook } from '../../Interfaces/request-handler.js';
import { RouteConfig } from './HttpMethods.js';
import { CREATOR, ERROR_HANDLERS, HANDLERS, HOOKS } from '../../Symbols/index.js';
import { ClassPropsHelper, ErrorHandlerHelper } from '../Helpers/index.js';

type ParsedRouteConfig = { url: string; options: RouteShorthandOptions };

const parseConfig = (config: string | RouteConfig = '/', options: RouteShorthandOptions = {}): ParsedRouteConfig => {
  if (typeof config === 'string') return { url: config, options };

  const parsed = { options, ...config };
  return {
    ...parsed,
    options: { ...parsed.options },
  };
};

const requestHandlersCache = new WeakMap<FastifyRequest, RequestHandler>();

const getTarget = (Target: any, request: FastifyRequest, ...rest: unknown[]) => {
  if (requestHandlersCache.has(request)) return requestHandlersCache.get(request);
  const target = new Target(request, ...rest);
  requestHandlersCache.set(request, target);
  return target;
};

export const requestDecoratorsFactory = (method: HttpMethod) => (routeOrConfig?: string | RouteConfig, options?: RouteShorthandOptions) => {
  const config = parseConfig(routeOrConfig, options);
  return (target: any, propKey?: string | symbol) => {
    if (propKey) controllerMethodDecoratorsFactory(method, config, target, propKey);
    else
      target[CREATOR] = {
        register: (instance: FastifyInstance) => {
          if (ClassPropsHelper.hasHooks(target)) {
            for (const hook of target[HOOKS] as RequestHook[]) {
              const hookFn = (request: FastifyRequest, ...rest: unknown[]) => {
                return getTarget(target, request, ...rest)[hook.handlerName](request, ...rest);
              };
              const option = config.options[hook.name];
              if (option == null) config.options[hook.name] = hookFn;
              else if (Array.isArray(option)) option.push(hookFn);
              else config.options[hook.name] = [option as (...args: unknown[]) => void, hookFn];
            }
          }
          if (ClassPropsHelper.hasErrorHandlers(target)) {
            config.options.errorHandler = (error, request, ...rest) => {
              const errorHandler = ErrorHandlerHelper.create(target[ERROR_HANDLERS], getTarget(target, request, ...rest));
              return errorHandler(error, request, ...rest);
            };
          }
          instance[method](config.url, config.options, function (request, ...rest) {
            return getTarget(target, request, ...rest).handle();
          });
        },
      };
  };
};

const controllerMethodDecoratorsFactory = (method: HttpMethod, config: ParsedRouteConfig, { constructor }: any, propKey: string | symbol) => {
  ClassPropsHelper.ensureHandlers(constructor);
  constructor[HANDLERS].push({
    url: config.url,
    method,
    options: config.options,
    handlerMethod: propKey,
  });
};
