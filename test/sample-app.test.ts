/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { GET } from '../lib/decorators';
import { RequestHandler } from '../lib/interfaces';
import { REGISTER } from '../lib/symbols';
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

    SampleAppTest[REGISTER](instance);

    const res = await instance.inject({
        method: 'GET',
        url: '/sample'
    });

    t.match(res.payload, `{"message":"OK!"}`);
});
