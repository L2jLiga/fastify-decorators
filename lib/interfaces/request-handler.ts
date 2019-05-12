/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { FastifyReply, FastifyRequest } from 'fastify';
import { IncomingMessage, ServerResponse } from 'http';
import { Server } from 'tls';

export abstract class RequestHandler<HttpServer = Server, Request = IncomingMessage, Response = ServerResponse> {
    protected constructor(protected request: FastifyRequest<IncomingMessage>,
                          protected reply: FastifyReply<Response>) {
    }

    abstract handle(): void | Promise<any>;

    static readonly register = () => {
    };
}
