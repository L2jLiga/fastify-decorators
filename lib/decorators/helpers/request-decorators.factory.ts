/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { FastifyInstance } from 'fastify';
import { RequestHandler, RouteConfig } from '../../interfaces';
import { HttpMethods } from './http-methods';

export function requestDecoratorsFactory(method: HttpMethods) {
    return (config: RouteConfig) => {
        return (Handler: any) => {
            const options = config.options || {};

            Handler.register = (instance: FastifyInstance) => instance[method](config.url, options, (req, res) => (<RequestHandler>new Handler(req, res)).handle());

            return Handler;
        };
    };
}
