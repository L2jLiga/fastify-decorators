/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { Constructable, hasErrorHandlers, hasHandlers, hasHooks } from 'fastify-decorators/plugins';
import { FASTIFY_REPLY, FASTIFY_REQUEST, SERVICE_INJECTION } from '../../symbols.js';
import { hasServiceInjection } from './ensure-service-injection.js';

export function patchMethods<C>(constructor: Constructable<C>): void {
  if (hasHandlers(constructor)) patchHandlers(constructor);
  if (hasErrorHandlers(constructor)) patchErrorsHandlers(constructor);
  if (hasHooks(constructor)) patchHooks(constructor);
}

function patchHandlers(constructor: any): void {
  for (const it of constructor[Symbol.for('fastify-decorators.handlers')]) {
    patchMethod(constructor, it.handlerMethod);
  }
}

function patchErrorsHandlers(constructor: any): void {
  for (const it of constructor[Symbol.for('fastify-decorators.error-handlers')]) {
    patchMethod(constructor, it.handlerName);
  }
}

function patchHooks(constructor: any): void {
  for (const it of constructor[Symbol.for('fastify-decorators.hooks')]) {
    patchMethod(constructor, it.handlerName);
  }
}

function patchMethod(constructor: any, methodName: string | symbol): void {
  const _original = constructor.prototype[methodName];

  constructor.prototype[methodName] = function methodProxy(request: unknown, reply: unknown, ...rest: unknown[]) {
    return _original.call(createProxy(this, request, reply), request, reply, ...rest);
  };
}

function createProxy(target: any, request: unknown, reply: unknown): unknown {
  return new Proxy(target, {
    get(target, p) {
      const value = target[p];

      if (value === FASTIFY_REQUEST) return request;
      if (value === FASTIFY_REPLY) return reply;

      if (hasServiceInjection(value)) return createProxy(value, request, reply);

      return value;
    },
    /**
     * Avoid creating proxies over proxies by telling that already proxied class does not have any service injection
     */
    has(target, p): boolean {
      if (p === SERVICE_INJECTION) return false;
      return p in target;
    },
  });
}
