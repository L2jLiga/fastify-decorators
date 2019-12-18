/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { GET, RequestHandler } from 'fastify-decorators';
import { CREATOR } from 'fastify-decorators/symbols';
import fastify = require('fastify');

const tap = require('tap');

@GET({
    url: '/sample',
    options: {}
})
class SampleAppTest extends RequestHandler {
    async handle() {
        return {message: 'OK!'};
    }
}

tap.test('Should work', async (t: any) => {
    const instance = fastify();

    SampleAppTest[CREATOR].register(instance);

    const res = await instance.inject({
        method: 'GET',
        url: '/sample'
    });

    t.match(res.payload, `{"message":"OK!"}`);
});
