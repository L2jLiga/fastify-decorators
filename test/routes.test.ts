/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { instance } from '../src';

const tap = require('tap');

tap.test('Post handler', async (t: any) => {
    const res = await instance.inject({
        method: 'POST',
        url: '/post',
        payload: { message: 'POST works!' }
    });

    t.match(res.payload, `{"message":"POST works!"}`);
});

tap.test('Post handler should filter extra fields from payload message according to schema', async (t: any) => {
    const res = await instance.inject({
        method: 'POST',
        url: '/post',
        payload: { message: 'POST works!', text: 'blah-blah-blah' }
    });

    t.match(res.payload, `{"message":"POST works!"}`);
});

tap.test('Post handler should coerce message type to string in reply', async (t: any) => {
    const res = await instance.inject({
        method: 'POST',
        url: '/post',
        payload: { message: 1234 }
    });

    t.match(res.payload, `{"message":"1234"}`);
});

tap.test('Get handler', async (t: any) => {
    const res = await instance.inject({
        method: 'GET',
        url: '/get'
    });

    t.match(res.payload, `{"message":"GET works!"}`);
});

tap.test('Put handler', async (t: any) => {
    const res = await instance.inject({
        method: 'PUT',
        url: '/put',
        payload: { message: 'PUT works!' }
    });

    t.match(res.payload, `{"message":"PUT works!"}`);
});

tap.test('Patch handler', async (t: any) => {
    const res = await instance.inject({
        method: 'PATCH',
        url: '/patch',
        payload: { message: 'PATCH works!' }
    });

    t.match(res.payload, `{"message":"PATCH works!"}`);
});

tap.test('Delete handler', async (t: any) => {
    const res = await instance.inject({
        method: 'DELETE',
        url: '/delete'
    });

    t.match(res.payload, `{"message":"DELETE works!"}`);
});

tap.test('GET request to AllHandler', async (t: any) => {
    const res = await instance.inject({
        method: 'GET',
        url: '/all'
    });

    t.match(res.payload, `{"message":"All fine! :)"}`);
});

tap.test('POST request to AllHandler', async (t: any) => {
    const res = await instance.inject({
        method: 'POST',
        url: '/all',
        payload: { message: 'test' }
    });

    t.match(res.payload, `{"message":"test"}`);
});

tap.test('Head handler', async (t: any) => {
    const res = await instance.inject({
        method: 'HEAD',
        url: '/head'
    });

    t.match(res.headers, { header: 'value' });
});

tap.test('Options handler', async (t: any) => {
    const res = await instance.inject({
        method: 'OPTIONS',
        url: '/options'
    });

    t.match(res.headers, { allow: 'OPTIONS' });
});

tap.test('Controller should work', async (t: any) => {
    const res = await instance.inject({
        url: '/demo/test'
    });

    t.match(res.payload, `{"message":"Service works!"}`);
});

tap.test('Auth controller should return 401 when no cookie set', async (t: any) => {
    const res = await instance.inject('/authorized');

    t.match(res.statusCode, 401);
});

tap.test('Auth controller should reply when cookie is set', async (t: any) => {
    const res = await instance.inject({
        url: '/authorized',
        headers: {
            Cookie: 'token=blah'
        }
    });

    t.match(res.statusCode, 200);
});

tap.test('should set cookie', async (t: any) => {
    const res = await instance.inject({
        url: '/authorized',
        method: 'POST',
        payload: { login: 'test', password: 'test' }
    });

    t.match(res.statusCode, 200);
    t.match(res.headers['set-cookie'], 'token=dGVzdHRlc3Q=; path=/; HttpOnly');
});

tap.test('should reply with text', async (t: any) => {
    const res = await instance.inject({
        url: '/demo'
    });

    t.match(res.statusCode, 200);
    t.match(res.headers['content-type'], 'text/plain');
    t.match(res.payload, instance.printRoutes());
});
