/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import type { Injectables } from '../interfaces/injectable-class.js';
import { FASTIFY_REPLY, FASTIFY_REQUEST, FastifyReplyToken, FastifyRequestToken } from '../symbols/index.js';
import { wrapInjectable } from '../utils/wrap-injectable.js';

export const injectables: Injectables = new Map([
  [FastifyRequestToken, wrapInjectable(FASTIFY_REQUEST)],
  [FastifyReplyToken, wrapInjectable(FASTIFY_REPLY)],
]);
