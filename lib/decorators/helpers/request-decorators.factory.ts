/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import type { FastifyInstance, FastifyRequest, RouteShorthandOptions } from 'fastify';
import { HttpMethods, RequestHandler, RouteConfig } from '../../interfaces/index.js';
import { Constructable, getErrorHandlerContainer, getHandlersContainer, getHooksContainer, hooksRegistry, Registrable } from '../../plugins/index.js';
import { CREATOR } from '../../symbols/index.js';
import { transformAndWait } from '../../utils/transform-and-wait.js';
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

      // TODO: call hooks
      target[CREATOR].register = (instance: FastifyInstance) => {
        for (const hook of getHooksContainer(target)) {
          const hookFn = (request: FastifyRequest, ...rest: unknown[]) => {
            return getTarget(target, request, ...rest).then((t) =>
              (t as unknown as Record<string, (...args: unknown[]) => unknown>)[hook.handlerName as string](request, ...rest),
            );
          };

          const option = config.options[hook.name as 'onRequest'];
          if (option == null) config.options[hook.name as 'onRequest'] = hookFn;
          else if (Array.isArray(option)) option.push(hookFn);
          else config.options[hook.name as 'onRequest'] = [option as (...args: unknown[]) => void, hookFn];
        }

        const errorHandlers = getErrorHandlerContainer(target);
        if (errorHandlers.length > 0) {
          config.options.errorHandler = async (error, request, ...rest) => {
            const errorsHandler = createErrorsHandler(errorHandlers, (await getTarget(target, request, ...rest)) as never);

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
  const container = getHandlersContainer(constructor);

  container.push({
    url: config.url,
    method,
    options: config.options,
    handlerMethod: propKey,
  });
}
