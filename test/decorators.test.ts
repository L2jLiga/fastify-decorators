/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { ALL, Controller, DELETE, GET, HEAD, Hook, OPTIONS, PATCH, POST, PUT } from 'fastify-decorators';
import { injectDefaultControllerOptions } from 'fastify-decorators/decorators/helpers/inject-controller-options';
import { CONTROLLER, REGISTER } from 'fastify-decorators/symbols';

const tap = require('tap');

tap.test('ALL decorator should patch sample class', async (t: any) => {
    class A {}

    ALL({url: '/'})(A);

    t.match(typeof (A as any)[REGISTER], 'function')
});

tap.test('DELETE decorator should patch sample class', async (t: any) => {
    class A {}

    DELETE({url: '/'})(A);

    t.match(typeof (A as any)[REGISTER], 'function')
});

tap.test('GET decorator should patch sample class', async (t: any) => {
    class A {}

    GET({url: '/'})(A);

    t.match(typeof (A as any)[REGISTER], 'function')
});

tap.test('HEAD decorator should patch sample class', async (t: any) => {
    class A {}

    HEAD({url: '/'})(A);

    t.match(typeof (A as any)[REGISTER], 'function')
});

tap.test('OPTIONS decorator should patch sample class', async (t: any) => {
    class A {}

    OPTIONS({url: '/'})(A);

    t.match(typeof (A as any)[REGISTER], 'function')
});

tap.test('PATCH decorator should patch sample class', async (t: any) => {
    class A {}

    PATCH({url: '/'})(A);

    t.match(typeof (A as any)[REGISTER], 'function')
});

tap.test('POST decorator should patch sample class', async (t: any) => {
    class A {}

    POST({url: '/'})(A);

    t.match(typeof (A as any)[REGISTER], 'function')
});

tap.test('PUT decorator should patch sample class', async (t: any) => {
    class A {}

    PUT({url: '/'})(A);

    t.match(typeof (A as any)[REGISTER], 'function')
});

tap.test('Controller decorator should patch sample class', async (t: any) => {
    class A {}

    injectDefaultControllerOptions(A);

    Controller({route: '/'})(A);

    t.match(typeof (A as any)[CONTROLLER].register, `function`);
});

tap.test(`GET decorator should patch sample class method`, async (t: any) => {
    class A {
        async handler() {}
    }

    GET({url: '/'})(new A, 'handler');

    t.match((A as any)[CONTROLLER].handlers[0], {
        url: '/',
        method: 'get',
        options: {},
        handlerMethod: 'handler'
    })
});

tap.test(`GET decorator should not replace controller options`, async (t: any) => {
    class A {
        async handler() {}
        static [CONTROLLER] = {
            handlers: [{}, {}]
        }
    }

    GET({url: '/'})(new A, 'handler');

    t.match((A as any)[CONTROLLER].handlers.length, 3);
});

tap.test('Hook decorator should patch sample class method', async (t: any) => {
    class A {
        async hook() {}
    }

    Hook('onSend')(new A, 'hook');

    t.match((A as any)[CONTROLLER].hooks[0], {
        name: 'onSend',
        handlerName: 'hook'
    });
});
