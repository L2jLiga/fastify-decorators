/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { GET, RequestHandler } from 'fastify-decorators';

@GET({
    url: '/get',
    options: {},
})
class GetHandler extends RequestHandler {
    public async handle(): Promise<{ message: string }> {
        return { message: 'GET works!' };
    }
}

export = GetHandler;
