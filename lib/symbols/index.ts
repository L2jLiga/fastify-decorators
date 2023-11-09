/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

export const CREATOR = Symbol.for('fastify-decorators.creator');
export const ERROR_HANDLERS = Symbol.for('fastify-decorators.error-handlers');
export const HANDLERS = Symbol.for('fastify-decorators.handlers');
export const HOOKS = Symbol.for('fastify-decorators.hooks');

// Metadata symbol polyfill, used by ES Decorators
export const METADATA: unique symbol =
  // @ts-expect-error Stage 3 https://github.com/tc39/proposal-decorator-metadata
  (Symbol.metadata = Symbol.metadata ?? Symbol('Symbol.metadata'));
