/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { POST } from '../../../lib/decorators';
import { RequestHandler } from '../../../lib/interfaces';

@POST({
    url: '/post'
})
class PostHandler extends RequestHandler {
    async handle() {
        return this.request.body.message;
    }
}

export = PostHandler;
