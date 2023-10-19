/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { Constructable, ERROR_HANDLERS, HANDLERS, hasErrorHandlers, hasHandlers, hasHooks, HOOKS, Registrable } from 'fastify-decorators/plugins';
import { FASTIFY_REPLY, FASTIFY_REQUEST, SERVICE_INJECTION } from '../../symbols.js';
import { hasServiceInjection } from './ensure-service-injection.js';

export function patchMethods<C>(constructor: Registrable<C>): void {
  if (hasHandlers(constructor)) patchHandlers(constructor);
  if (hasErrorHandlers(constructor)) patchErrorsHandlers(constructor);
  if (hasHooks(constructor)) patchHooks(constructor);
}

function patchHandlers<C>(constructor: Registrable<C>): void {
  if (hasHandlers(constructor))
    for (const it of constructor[HANDLERS]) {
      patchMethod(constructor, it.handlerMethod);
    }
}

function patchErrorsHandlers<C>(constructor: Registrable<C>): void {
  if (hasErrorHandlers(constructor))
    for (const it of constructor[ERROR_HANDLERS]) {
      patchMethod(constructor, it.handlerName);
    }
}

function patchHooks<C>(constructor: Registrable<C>): void {
  if (hasHooks(constructor))
    for (const it of constructor[HOOKS]) {
      patchMethod(constructor, it.handlerName);
    }
}

function patchMethod<C>(constructor: Registrable<C>, methodName: string | symbol): void {
  const _original = constructor.prototype[methodName];

  constructor.prototype[methodName] = function methodProxy(request: unknown, reply: unknown, ...rest: unknown[]) {
    return _original.call(createProxy(this, request, reply), request, reply, ...rest);
  };
}

const _PROXY_CACHE = new WeakMap<WeakKey, unknown>();

function createProxy<C>(target: Constructable<C>, request: unknown, reply: unknown): unknown {
  if (_PROXY_CACHE.has(request as WeakKey)) return _PROXY_CACHE.get(request as WeakKey);

  const proxy = new Proxy(target, {
    get(target, p) {
      const value = target[p as keyof typeof target];

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

  return _PROXY_CACHE.set(request as WeakKey, proxy).get(request as WeakKey);
}
