/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { OPTIONS, RequestHandler } from 'fastify-decorators';

@OPTIONS({
    url: '/options'
})
class OptionsHandler extends RequestHandler {
    public async handle(): Promise<any> {
        this.reply.header('Allow', 'OPTIONS');

        return '';
    }
}

export = OptionsHandler;
