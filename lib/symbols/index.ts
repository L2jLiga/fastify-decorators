/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

export const CREATOR = Symbol.for('fastify-decorators.creator');
export const INJECTABLES = Symbol.for('fastify-decorators.injectables');
export const INITIALIZER = Symbol.for('fastify-decorators.initializer');
export const ERROR_HANDLERS = Symbol.for('fastify-decorators.error-handlers');
export const HANDLERS = Symbol.for('fastify-decorators.handlers');
export const HOOKS = Symbol.for('fastify-decorators.hooks');
export const SERVICE_INJECTION = Symbol.for('fastify-decorators.service-injection');

export const FastifyInstanceToken = Symbol.for('fastify-decorators.fastify-instance');
