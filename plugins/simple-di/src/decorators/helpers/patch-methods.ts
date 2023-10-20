/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { Constructable, getErrorHandlerContainer, getHandlersContainer, getHooksContainer, Registrable } from 'fastify-decorators/plugins';
import { FASTIFY_REPLY, FASTIFY_REQUEST, SERVICE_INJECTION } from '../../symbols.js';
import { hasServiceInjection } from './ensure-service-injection.js';

export function patchMethods<C>(constructor: Registrable<C>): void {
  for (const { handlerMethod } of getHandlersContainer(constructor)) patchMethod(constructor, handlerMethod);
  for (const { handlerName } of getErrorHandlerContainer(constructor)) patchMethod(constructor, handlerName);
  for (const { handlerName } of getHooksContainer(constructor)) patchMethod(constructor, handlerName);
}

function patchMethod<C>(constructor: Registrable<C>, methodName: string | symbol): void {
  const _original = constructor.prototype[methodName];

  constructor.prototype[methodName] = function methodProxy(request: unknown, reply: unknown, ...rest: unknown[]) {
    return _original.call(createProxy(this, request, reply), request, reply, ...rest);
  };
}

const _PROXY_CACHE = new WeakMap<WeakKey, WeakMap<WeakKey, unknown>>();

function createProxy<C>(target: Constructable<C>, request: unknown, reply: unknown): unknown {
  if (!_PROXY_CACHE.has(target)) _PROXY_CACHE.set(target, new WeakMap());
  const targetProxyCache = _PROXY_CACHE.get(target) as WeakMap<WeakKey, unknown>;
  if (targetProxyCache.has(request as WeakKey)) return targetProxyCache.get(request as WeakKey);

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

  return targetProxyCache.set(request as WeakKey, proxy).get(request as WeakKey);
}
