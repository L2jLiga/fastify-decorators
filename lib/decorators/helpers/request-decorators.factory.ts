/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import type { FastifyInstance, FastifyRequest, RouteShorthandOptions } from 'fastify';
import { HttpMethods, RequestHandler, RouteConfig } from '../../interfaces/index.js';
import { Constructable, hooksRegistry, Registrable } from '../../plugins/index.js';
import { CREATOR, ERROR_HANDLERS, HANDLERS, HOOKS } from '../../symbols/index.js';
import { transformAndWait } from '../../utils/transform-and-wait.js';
import { ensureHandlers, hasErrorHandlers, hasHooks } from './class-properties.js';
import { createErrorsHandler } from './create-errors-handler.js';
import { ensureRegistrable } from './ensure-registrable.js';

type ParsedRouteConfig = { url: string; options: RouteShorthandOptions };

function parseConfig(config: string | RouteConfig = '/', options: RouteShorthandOptions = {}): ParsedRouteConfig {
  if (typeof config === 'string') return { url: config, options };

  const parsed = { options, ...config };
  return {
    ...parsed,
    options: { ...parsed.options },
  };
}

const requestHandlersCache = new WeakMap<FastifyRequest, RequestHandler>();

async function getTarget(target: Registrable<RequestHandler>, request: FastifyRequest, ...rest: unknown[]): Promise<RequestHandler> {
  if (requestHandlersCache.has(request)) return requestHandlersCache.get(request)!;
  const instance = new target(request, ...rest);
  await transformAndWait(hooksRegistry.afterControllerCreation, (hook) => hook(request.server, target, instance));
  requestHandlersCache.set(request, instance);
  return instance;
}

export function requestDecoratorsFactory(method: HttpMethods) {
  return function (routeOrConfig?: string | RouteConfig, options?: RouteShorthandOptions): (target: Constructable, propKey?: string | symbol) => void {
    const config = parseConfig(routeOrConfig, options);

    return function (target, propKey) {
      if (propKey) {
        controllerMethodDecoratorsFactory(method, config, target, propKey);
        return;
      }

      ensureRegistrable<typeof target, RequestHandler>(target);

      target[CREATOR].register = (instance: FastifyInstance) => {
        if (hasHooks(target)) {
          for (const hook of target[HOOKS]) {
            const hookFn = (request: FastifyRequest, ...rest: unknown[]) => {
              return getTarget(target, request, ...rest).then((t) =>
                (t as unknown as Record<string, (...args: unknown[]) => unknown>)[hook.handlerName as string](request, ...rest),
              );
            };

            const option = config.options[hook.name];
            if (option == null) config.options[hook.name] = hookFn;
            else if (Array.isArray(option)) option.push(hookFn);
            else config.options[hook.name] = [option as (...args: unknown[]) => void, hookFn];
          }
        }
        if (hasErrorHandlers(target)) {
          config.options.errorHandler = async (error, request, ...rest) => {
            const errorsHandler = createErrorsHandler(target[ERROR_HANDLERS], (await getTarget(target, request, ...rest)) as never);

            return errorsHandler(error, request, ...rest);
          };
        }
        instance[method](config.url, config.options, function (request, ...rest) {
          return getTarget(target, request, ...rest).then((t) => t.handle());
        });
      };
    };
  };
}

export function controllerMethodDecoratorsFactory(
  method: HttpMethods,
  config: ParsedRouteConfig,
  { constructor }: Constructable,
  propKey: string | symbol,
): void {
  ensureHandlers(constructor);

  constructor[HANDLERS].push({
    url: config.url,
    method,
    options: config.options,
    handlerMethod: propKey,
  });
}
