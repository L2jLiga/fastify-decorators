/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { PUT, RequestHandler } from 'fastify-decorators';

@PUT('/put')
class PutHandler extends RequestHandler {
    public async handle(): Promise<any> {
        return {message: this.request.body.message};
    }
}

export = PutHandler;
