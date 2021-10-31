import { hasErrorHandlers, hasHandlers, hasHooks } from 'fastify-decorators/plugins';
import { FASTIFY_REPLY, FASTIFY_REQUEST, SERVICE_INJECTION } from '../../symbols.js';
import { hasServiceInjection } from './ensure-service-injection.js';
import { Constructor } from './inject-dependencies.js';

export function patchMethods<C>(constructor: Constructor<C>): void {
  if (hasHandlers(constructor)) patchHandlers(constructor);
  if (hasErrorHandlers(constructor)) patchErrorsHandlers(constructor);
  if (hasHooks(constructor)) patchHooks(constructor);
}

function patchHandlers(constructor: any): void {
  constructor[Symbol.for('fastify-decorators.handlers')].forEach((it: { handlerMethod: string | symbol }) => {
    const _original = constructor.prototype[it.handlerMethod];

    constructor.prototype[it.handlerMethod] = function handleRequest(request: unknown, reply: unknown, ...rest: unknown[]) {
      const proxy = new Proxy(this, {
        get(target, p: string | symbol): unknown {
          const value = target[p];

          if (hasServiceInjection(value)) {
            return new Proxy(value, {
              get(target, p) {
                if (typeof target[p] === 'function')
                  return target[p].bind(
                    new Proxy(target, {
                      get(target, p): any {
                        if (p === FASTIFY_REQUEST || target[p] === FASTIFY_REQUEST) {
                          return request;
                        }
                        if (p === FASTIFY_REPLY || target[p] === FASTIFY_REPLY) {
                          return reply;
                        }
                        return target[p];
                      },
                    }),
                  );
                return target[p];
              },
              has(target, p): boolean {
                if (p === SERVICE_INJECTION) return false;
                return p in target;
              },
            });
          }

          return value;
        },
      });

      return _original.call(proxy, request, reply, ...rest);
    };
  });
}

function patchErrorsHandlers(constructor: any): void {
  constructor[Symbol.for('fastify-decorators.error-handlers')].forEach((it: { handlerName: string | symbol }) => {
    const _original = constructor.prototype[it.handlerName];

    constructor.prototype[it.handlerName] = function handleRequest(request: unknown, reply: unknown, ...rest: unknown[]) {
      const proxy = new Proxy(this, {
        get(target, p: string | symbol): unknown {
          const value = target[p];

          if (value instanceof Proxy) {
            return new Proxy(value, {
              get(target, p) {
                if (p === FASTIFY_REQUEST) return request;
                if (p === FASTIFY_REPLY) return reply;

                return target[p];
              },
            });
          }

          return value;
        },
      });

      return _original.call(proxy, request, reply, ...rest);
    };
  });
}

function patchHooks(constructor: any): void {
  constructor[Symbol.for('fastify-decorators.hooks')].forEach((it: { handlerName: string | symbol }) => {
    const _original = constructor.prototype[it.handlerName];

    constructor.prototype[it.handlerName] = function handleRequest(request: unknown, reply: unknown, ...rest: unknown[]) {
      const proxy = new Proxy(this, {
        get(target, p: string | symbol): unknown {
          const value = target[p];

          if (value instanceof Proxy) {
            return new Proxy(value, {
              get(target, p) {
                if (p === FASTIFY_REQUEST) return request;
                if (p === FASTIFY_REPLY) return reply;

                return target[p];
              },
            });
          }

          return value;
        },
      });

      return _original.call(proxy, request, reply, ...rest);
    };
  });
}
