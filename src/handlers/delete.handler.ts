/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { DELETE, RequestHandler } from 'fastify-decorators';

@DELETE('/delete')
class DeleteHandler extends RequestHandler {
    public async handle(): Promise<{ message: string }> {
        return { message: 'DELETE works!' };
    }
}

export = DeleteHandler;
