/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { Controller, GET } from '../../lib/decorators';

@Controller({
    route: '/ctrl'
})
class TestController {
    @GET({
        url: '/index'
    })
    async index() {
        return 'Test controller: index';
    }
}

export = TestController;
