/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

export const CREATOR = Symbol('fastify-decorators.creator');
export const INJECTABLES = Symbol('fastify-decorators.injectables');
export const INITIALIZER = Symbol('fastify-decorators.initializer');
export const ERROR_HANDLERS = Symbol('fastify-decorators.error-handlers');
export const HANDLERS = Symbol('fastify-decorators.handlers');
export const HOOKS = Symbol('fastify-decorators.handlers');

export const FastifyInstanceToken = Symbol('Token to inject FastifyInstance');
