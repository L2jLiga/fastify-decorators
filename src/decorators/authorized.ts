/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { FastifyReply, FastifyRequest } from 'fastify';

export async function authorization(request: FastifyRequest, reply: FastifyReply, done: (err?: Error) => void): Promise<void> {
    const token = request.headers.cookie?.split(';')
        .map<string>((it: string) => it.trim())
        .map<[string, string]>((it: string) => it.split('=') as [string, string])
        .find(([name]: [string, string]) => name === 'token')
        ?.[1];

    if (!token) reply.status(401).send({ message: 'Not authorized!' });

    done();
}
