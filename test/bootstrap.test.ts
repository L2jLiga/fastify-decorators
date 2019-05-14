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

tap.test('read handlers directory recursively and bootstrap all', async (t: any) => {
    const instance = fastify();

    instance.register(bootstrap, {
        handlersDirectory: join(__dirname, 'handlers'),
        prefix: '/sample'
    });

    const getRequest = await instance.inject({url: `/sample/get`});
    const postRequest = await instance.inject({url: `/sample/post`, method: 'POST', payload: {message: 'OK!'}});

    t.match(getRequest.payload, `{"message":"OK!"}`);
    t.match(postRequest.payload, `OK!`);
});
