/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { FastifyInstance, FastifyReply, FastifyRequest, preValidationHookHandler } from 'fastify';
import { Controller, FastifyInstanceToken, GET, getInstanceByToken, POST } from 'fastify-decorators';

@Controller('/authorized')
export default class AuthController {
    private static instance = getInstanceByToken<FastifyInstance & { authorization: preValidationHookHandler }>(FastifyInstanceToken);

    @GET({
        url: '/',
        options: {
            preValidation: AuthController.instance.authorization,
        },
    })
    async authorizedOnly(): Promise<{ message: string }> {
        return { message: 'authorized!' };
    }

    @POST({
        url: '/',
        options: {
            schema: {
                body: {
                    type: 'object',
                    properties: {
                        login: { type: 'string' },
                        password: { type: 'string' },
                    },
                },
            }
        }
    })
    login(request: FastifyRequest<{ Body: { login: string; password: string } }>, reply: FastifyReply): void {
        const { login, password } = request.body;

        reply.header('Set-Cookie', `token=${Buffer.from(login + password).toString('base64')}; path=/; HttpOnly`);
        reply.status(200);
        reply.send({ status: 'ok!' });
    }
}
