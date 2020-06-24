/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { HEAD, RequestHandler } from 'fastify-decorators';

@HEAD('/head')
class HeadHandler extends RequestHandler {
    public async handle(): Promise<string> {
        this.reply.header('header', 'value');

        return '';
    }
}

export = HeadHandler;
