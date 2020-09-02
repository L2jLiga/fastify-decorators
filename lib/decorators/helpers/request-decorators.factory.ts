/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { FastifyInstance, FastifyRequest, RouteShorthandOptions } from 'fastify';
import { RequestHandler, RouteConfig } from '../../interfaces';
import { CREATOR, ERROR_HANDLERS, HANDLERS, HOOKS } from '../../symbols';
import { ensureHandlers, hasErrorHandlers, hasHooks } from './class-properties';
import { createErrorsHandler } from './create-errors-handler';
import { HttpMethods } from './http-methods';

/*
function parseConfig(config?: string | RouteConfig, opts?: RouteShorthandOptions): RouteConfig & { options: RouteShorthandOptions } {
    let url = '/';
    let options: RouteShorthandOptions = {};

    if (typeof config === 'string') url = config;
    if (config && typeof config === 'object') {
        if (config.url !== undefined) url = config.url;
        if (config.options !== undefined) options = config.options;
    }
    if (opts && typeof opts === 'object') options = opts;

    return { options, url };
}
*/

function parseConfig(config: string | RouteConfig = '/', options: RouteShorthandOptions = {}): RouteConfig & { options: RouteShorthandOptions } {
    if (typeof config === 'string') return { url: config, options };

    return { options, ...config };
}

const requestHandlersCache = new WeakMap<FastifyRequest, RequestHandler>()
function getTarget(Target: any, request: FastifyRequest, ...rest: unknown[]) {
    if (requestHandlersCache.has(request)) return requestHandlersCache.get(request);
    const target = new Target(request, ...rest);
    requestHandlersCache.set(request, target);
    return target;
}

export function requestDecoratorsFactory(
    method: HttpMethods
): (routeOrConfig?: (string | RouteConfig), options?: RouteShorthandOptions) => (target: any, propKey?: (string | symbol)) => void {
    return function (routeOrConfig?: string | RouteConfig, options?: RouteShorthandOptions): (target: any, propKey?: string | symbol) => void {
        const config = parseConfig(routeOrConfig, options);

        return function (target: any, propKey?: string | symbol): void {
            if (propKey) {
                controllerMethodDecoratorsFactory(method, config, target, propKey);
                return;
            }

            target[CREATOR] = {
                register: (instance: FastifyInstance) => {
                    if (hasHooks(target)) {
                        for (const hook of target[HOOKS]) {
                            // @ts-expect-error we know that hook.name is name of Fastify hook
                            config.options[hook.name] = (request: FastifyRequest, ...rest: unknown[]) => {
                                return getTarget(target, request, rest)[hook.handlerName](request, ...rest);
                            };
                        }
                    }
                    if (hasErrorHandlers(target)) {
                        config.options.errorHandler = (error, request, ...rest) => {
                            const errorsHandler = createErrorsHandler(target[ERROR_HANDLERS], getTarget(target, request, ...rest));

                            return errorsHandler(error, request, ...rest);
                        }
                    }
                    instance[method](config.url, config.options, function (request, ...rest) {
                        return getTarget(target, request, ...rest).handle();
                    })
                },
            };
        };
    };
}

export function controllerMethodDecoratorsFactory(method: HttpMethods, config: RouteConfig, { constructor }: any, propKey: string | symbol): void {
    ensureHandlers(constructor);

    constructor[HANDLERS].push({
        url: config.url,
        method,
        options: config.options || {},
        handlerMethod: propKey,
    });
}
