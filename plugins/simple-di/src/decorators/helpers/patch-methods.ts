import { FASTIFY_REPLY, FASTIFY_REQUEST, SERVICE_INJECTION } from '../../symbols.js';
import { hasServiceInjection } from './ensure-service-injection.js';
import { ERROR_HANDLER, getContainer, getMetadata, HOOK, REQUEST_HANDLER } from 'fastify-decorators/plugins';

export function patchMethods(constructor: object): void {
  const metadata = getMetadata(constructor);
  for (const { handlerName } of getContainer(metadata, REQUEST_HANDLER)) patchMethod(constructor, handlerName);
  for (const { handlerName } of getContainer(metadata, ERROR_HANDLER)) patchMethod(constructor, handlerName);
  for (const { handlerName } of getContainer(metadata, HOOK)) patchMethod(constructor, handlerName);
}

function patchMethod(constructor: object, methodName: PropertyKey): void {
  const _original = (constructor as { new (): object }).prototype[methodName];

  (constructor as { new (): object }).prototype[methodName] = function methodProxy(request: unknown, reply: unknown, ...rest: unknown[]) {
    return _original.call(createProxy(this, request, reply), request, reply, ...rest);
  };
}

const _PROXY_CACHE = new WeakMap<WeakKey, WeakMap<WeakKey, unknown>>();

function createProxy(target: object, request: unknown, reply: unknown): unknown {
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
