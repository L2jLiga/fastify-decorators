/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { ALL, RequestHandler } from 'fastify-decorators';

@ALL({
    url: '/all'
})
class AllHandler extends RequestHandler {
    public async handle(): Promise<any> {
        if (this.request.body)
            return {message: this.request.body.message};
        else return {message: 'All fine! :)'};
    }
}

export = AllHandler;
