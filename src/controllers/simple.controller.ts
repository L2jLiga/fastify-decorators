/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, Hook, Inject } from 'fastify-decorators';
import { MessageService } from '../services/message-service';
import { ServerService } from '../services/server-service';

@Controller('/demo')
export default class SimpleController {
    @Inject('serverService')
    private serverService!: ServerService;

    constructor(private service: MessageService) {
    }

    @GET({
        url: '/test',
        options: {
            schema: {
                response: {
                    200: {
                        properties: {
                            message: { type: 'string' },
                        },
                    },
                },
            }
        }
    })
    async test(): Promise<{ message: string }> {
        return { message: this.service.getMessage() };
    }

    @GET()
    async routes(): Promise<string> {
        return this.serverService.printRoutes()
    }

    @Hook('onSend')
    async hidePoweredBy(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        reply.header('X-Powered-By', 'nodejs');
    }
}
