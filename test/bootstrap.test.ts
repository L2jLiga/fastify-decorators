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

tap.test('load handlers recursively', async (t: any) => {
    const instance = fastify();

    instance.register(bootstrap, {
        handlersDirectory: join(__dirname, 'bootstrap-app'),
        prefix: '/sample'
    });

    const getHandler = await instance.inject({url: `/sample/get`});
    const postHandler = await instance.inject({url: `/sample/post`, method: 'POST', payload: {message: 'OK!'}});

    const testController = await instance.inject({url: '/sample/ctrl/index'});

    t.match(getHandler.payload, `{"message":"OK!"}`);
    t.match(postHandler.payload, `OK!`);
    t.match(testController.statusCode, 404);
});

tap.test(`load controllers and don't load handlers`, async (t: any) => {
    const instance = fastify();

    instance.register(bootstrap, {
        controllersDirectory: join(__dirname, 'bootstrap-app')
    });

    const getHandler = await instance.inject({url: `/get`});
    const testController = await instance.inject({url: '/ctrl/index'});

    t.match(getHandler.statusCode, 404);
    t.match(testController.payload, 'Test controller: index');
});

tap.test(`load both`, async (t: any) => {
    const instance = fastify();

    instance.register(bootstrap, {
        controllersDirectory: join(__dirname, 'bootstrap-app'),
        controllersMask: /\.controller\./,
        handlersDirectory: join(__dirname, 'bootstrap-app'),
        handlersMask: /\.handler\./
    });

    const getHandler = await instance.inject({url: `/get`});
    const testController = await instance.inject({url: '/ctrl/index'});

    t.match(getHandler.payload, `{"message":"OK!"}`);
    t.match(testController.payload, 'Test controller: index');
});