/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { bootstrap } from 'fastify-decorators';
import 'reflect-metadata';
import { authorization } from './decorators/authorized';
import fastify = require('fastify');
import websocketPlugin from 'fastify-websocket';

const instance = fastify();

instance.register(websocketPlugin);

instance.decorate('authorization', authorization);

instance.register(bootstrap, {
    directory: __dirname + '/controllers',
    mask: /\.controller\./
});

instance.register(bootstrap, {
    directory: __dirname + '/handlers',
    mask: /\.handler\./
});

export { instance };
