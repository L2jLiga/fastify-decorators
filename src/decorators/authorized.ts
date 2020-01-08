/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { FastifyReply, FastifyRequest } from 'fastify';
import { ServerResponse } from 'http';

export function authorization(request: FastifyRequest, reply: FastifyReply<ServerResponse>, done: Function) {
    if (request.headers.cookie) {
        const token = request.headers.cookie.split(';')
            .map((it: string) => it.trim())
            .map((it: string) => it.split('='))
            .find(([name]: [string, string]) => name === 'token')
            ?.[1];

        if (!token) reply.status(401).send({ message: 'Not authorized!' });
    }

    done();
}
