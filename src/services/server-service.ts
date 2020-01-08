/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { FastifyInstance } from 'fastify';
import { FastifyInstanceToken, Inject, Service } from 'fastify-decorators';

@Service('serverService')
export class ServerService {
    @Inject(FastifyInstanceToken)
    private instance!: FastifyInstance;

    public printRoutes(): string {
        return this.instance.printRoutes();
    }
}
