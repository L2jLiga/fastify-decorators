/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import fastify = require('fastify');
import { bootstrap } from 'fastify-decorators';

const instance = fastify();

instance.register(bootstrap, {
    directory: __dirname + '/controllers',
    mask: /\.controller\./
});

instance.register(bootstrap, {
    directory: __dirname + '/handlers',
    mask: /\.handler\./
});

export { instance };
