/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET } from 'fastify-decorators';
import { IncomingMessage, ServerResponse } from 'http';

@Controller({
    route: '/demo'
})
class SimpleController {
    @GET({
        url: '/test',
        options: {
            schema: {
                response: {
                    200: {
                        properties: {
                            message: {type: 'string'}
                        }
                    }
                }
            }
        }
    })
    async test(request: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) {
        return {message: this.message};
    }

    private message: string = 'Controller works!';
}

export = SimpleController;