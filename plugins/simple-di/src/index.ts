/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import 'reflect-metadata';

import { createInitializationHook } from 'fastify-decorators/plugins';
import { injectables } from './registry/injectables.js';
import { FastifyInstanceToken } from './symbols.js';
import { wrapInjectable } from './utils/wrap-injectable.js';

createInitializationHook('appInit', (fastify) => injectables.set(FastifyInstanceToken, wrapInjectable(fastify)));

export { getInstanceByToken } from './utils/get-instance-by-token.js';

export { Service } from './decorators/service.js';
export { Inject } from './decorators/inject.js';

export { Initializer } from './decorators/initializer.js';
export { Destructor } from './decorators/destructor.js';

export { FastifyInstanceToken, FastifyRequestToken, FastifyReplyToken } from './symbols.js';
