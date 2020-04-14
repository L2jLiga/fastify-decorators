/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

export const CREATOR = Symbol('Uses for storing register method of handler or controller');
export const INJECTABLES = Symbol('Uses for storing injectables map');

export const FastifyInstanceToken = Symbol('Token to inject FastifyInstance');
