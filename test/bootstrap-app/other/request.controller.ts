/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { FastifyReply, FastifyRequest } from 'fastify';
import { IncomingMessage, ServerResponse } from 'http';
import { Controller, GET, Hook } from '../../../lib/decorators';
import { AbstractController } from '../../../lib/interfaces';
import { ControllerType } from '../../../lib/registry';

@Controller({
    route: '/request',
    type: ControllerType.REQUEST
})
class RequestController extends AbstractController {
    private callsCount = 0;

    @GET({url: '/index'})
    async indexHandler() {
        this.instance.log.info('Handled request to /request/index');

        this.callsCount++;
        return 'Request controller: index handler, calls count: ' + this.callsCount;
    }

    @Hook('onSend')
    async hidePoweredBy(request: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) {
        reply.header('X-Powered-By', 'nodejs');
    }
}

export = RequestController;