/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { FastifyInstance } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { Inject } from '../decorators';
import { FastifyInstanceToken } from '../symbols';

/**
 * @deprecated use `@Inject` or `getInstanceByToken` instead
 */
export abstract class AbstractController<HttpServer = Server, HttpRequest = IncomingMessage, HttpResponse = ServerResponse> {
    public static instance: FastifyInstance;
    public instance!: FastifyInstance<HttpServer, HttpRequest, HttpResponse>;
}

Inject(FastifyInstanceToken)(AbstractController.prototype, 'instance');
Inject(FastifyInstanceToken)(AbstractController, 'instance');
