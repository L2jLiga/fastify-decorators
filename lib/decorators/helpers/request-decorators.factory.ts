/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { FastifyInstance, RouteShorthandOptions } from 'fastify';
import { RequestHandler, RouteConfig } from '../../interfaces';
import { CREATOR } from '../../symbols';
import { HttpMethods } from './http-methods';
import { injectDefaultControllerOptions } from './inject-controller-options';

function parseConfig(config: string | RouteConfig = '/', options: RouteShorthandOptions = {}): RouteConfig & { options: RouteShorthandOptions } {
    if (typeof config === 'string') return { url: config, options };

    return { options, ...config };
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
                register: (instance: FastifyInstance) => instance[method](config.url, config.options, function (...args) {
                    return (<RequestHandler>new target(...args)).handle();
                }),
            };
        };
    };
}

export function controllerMethodDecoratorsFactory(method: HttpMethods, config: RouteConfig, { constructor }: any, propKey: string | symbol): void {
    injectDefaultControllerOptions(constructor);

    const controllerOpts = constructor[CREATOR];

    controllerOpts.handlers.push({
        url: config.url,
        method,
        options: config.options || {},
        handlerMethod: propKey,
    });
}
