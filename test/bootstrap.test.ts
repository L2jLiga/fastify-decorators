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

tap.test('should load all recursively', async (t: any) => {
    const instance = fastify();

    instance.register(bootstrap, {
        directory: join(__dirname, 'bootstrap-app'),
        prefix: '/sample'
    });

    const getHandler = await instance.inject({url: `/sample/get`});
    const postHandler = await instance.inject({url: `/sample/post`, method: 'POST', payload: {message: 'OK!'}});
    const testController = await instance.inject({url: '/sample/ctrl/index'});
    const singletonCtrlRequest = await instance.inject({url: '/sample/request/index'});

    t.match(singletonCtrlRequest.payload, 'Request controller: index handler, calls count: 1');
    t.match(getHandler.payload, `{"message":"OK!"}`);
    t.match(postHandler.payload, `OK!`);
    t.match(testController.payload, 'Singleton controller: index handler, calls count: 1');
    t.match(testController.headers, {
        'x-powered-by': 'nodejs'
    });
});

tap.test('should load only matched by mask recursively', async (t: any) => {
    const instance = fastify();

    instance.register(bootstrap, {
        directory: join(__dirname, 'bootstrap-app'),
        mask: /\.controller\./,
        prefix: '/sample'
    });

    const getHandler = await instance.inject({url: `/sample/get`});
    const postHandler = await instance.inject({url: `/sample/post`, method: 'POST', payload: {message: 'OK!'}});
    const testController = await instance.inject({url: '/sample/ctrl/index'});
    const singletonCtrlRequest = await instance.inject({url: '/sample/request/index'});

    t.match(getHandler.statusCode, 404);
    t.match(postHandler.statusCode, 404);
    t.match(singletonCtrlRequest.payload, 'Request controller: index handler, calls count: 1');
    t.match(testController.payload, 'Singleton controller: index handler, calls count: 1');
});

// TODO: remove test below as far as separated handlers and controllers loaders are deprecated

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
    t.match(testController.payload, 'Singleton controller: index handler, calls count: 1');
    t.match(testController.headers, {
        'x-powered-by': 'nodejs'
    });
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
    t.match(testController.payload, 'Singleton controller: index handler, calls count: 1');
    t.match(testController.headers, {
        'x-powered-by': 'nodejs'
    });
});

tap.test(`singleton controller should keep state`, async (t: any) => {
    let singletonCtrlRequest;
    const instance = fastify();

    instance.register(bootstrap, {
        controllersDirectory: join(__dirname, 'bootstrap-app')
    });

    singletonCtrlRequest = await instance.inject({url: '/ctrl/index'});
    t.match(singletonCtrlRequest.payload, 'Singleton controller: index handler, calls count: 1');

    singletonCtrlRequest = await instance.inject({url: '/ctrl/index'});
    t.match(singletonCtrlRequest.payload, 'Singleton controller: index handler, calls count: 2');
});

tap.test(`request controller should not keep state`, async (t: any) => {
    let singletonCtrlRequest;
    const instance = fastify();

    instance.register(bootstrap, {
        controllersDirectory: join(__dirname, 'bootstrap-app')
    });

    singletonCtrlRequest = await instance.inject({url: '/request/index'});
    t.match(singletonCtrlRequest.payload, 'Request controller: index handler, calls count: 1');

    singletonCtrlRequest = await instance.inject({url: '/request/index'});
    t.match(singletonCtrlRequest.payload, 'Request controller: index handler, calls count: 1');
});
