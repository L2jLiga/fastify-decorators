/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import fastify = require('fastify');
import { join } from 'path';
import { bootstrap } from '../lib';

const tap = require('tap');

tap.test('Should bootstrap handlers', async (t: any) => {
    const instance = fastify();

    instance.register(bootstrap, {
        handlersDirectory: join(__dirname, 'handlers'),
        prefix: '/sample'
    });

    const res = await instance.inject({
        url: `/sample/get`
    });

    t.match(res.payload, `{"message":"OK!"}`);
});
