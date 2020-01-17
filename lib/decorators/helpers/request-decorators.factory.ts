/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { FastifyInstance } from 'fastify';
import { ControllerConstructor, RequestHandler, RouteConfig } from '../../interfaces';
import { CREATOR } from '../../symbols';
import { HttpMethods } from './http-methods';
import { injectDefaultControllerOptions } from './inject-controller-options';

export function requestDecoratorsFactory(method: HttpMethods) {
    return function (config?: string | RouteConfig) {
        return function (target: any, propKey?: string | symbol) {
            if (!config) config = { url: '/' };
            if (typeof config === 'string') config = { url: config };

            if (propKey) return controllerMethodDecoratorsFactory(method, config, target, propKey);
            const options = config.options || {};

            target[CREATOR] = {
                register: (instance: FastifyInstance) => instance[method]((<RouteConfig>config).url, options, function (...args) {
                    return (<RequestHandler>new target(...args)).handle();
                })
            };
        };
    };
}

export function controllerMethodDecoratorsFactory(method: HttpMethods, config: RouteConfig, target: any, propKey: string | symbol) {
    injectDefaultControllerOptions(target.constructor);

    const controllerOpts = (<ControllerConstructor>target.constructor)[CREATOR];

    controllerOpts.handlers.push({
        url: config.url,
        method,
        options: config.options || {},
        handlerMethod: propKey
    });
}
