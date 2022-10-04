import { FASTIFY_REPLY, FASTIFY_REQUEST, SERVICE_INJECTION } from '../../symbols/index.js';
import { hasErrorHandlers, hasHandlers, hasHooks, hasServiceInjection } from './class-properties.js';
import { Constructor } from './inject-dependencies.js';

export function patchMethods<C>(constructor: Constructor<C>): void {
  if (hasHandlers(constructor)) patchHandlers(constructor);
  if (hasErrorHandlers(constructor)) patchErrorsHandlers(constructor);
  if (hasHooks(constructor)) patchHooks(constructor);
}

function patchHandlers(constructor: any): void {
  constructor[Symbol.for('fastify-decorators.handlers')].forEach((it: { handlerMethod: string | symbol }) => {
    patchMethod(constructor, it.handlerMethod);
  });
}

function patchErrorsHandlers(constructor: any): void {
  constructor[Symbol.for('fastify-decorators.error-handlers')].forEach((it: { handlerName: string | symbol }) => {
    patchMethod(constructor, it.handlerName);
  });
}

function patchHooks(constructor: any): void {
  constructor[Symbol.for('fastify-decorators.hooks')].forEach((it: { handlerName: string | symbol }) => {
    patchMethod(constructor, it.handlerName);
  });
}

function patchMethod(constructor: any, methodName: string | symbol): void {
  const _original = constructor.prototype[methodName];

  constructor.prototype[methodName] = function methodProxy(request: unknown, reply: unknown, ...rest: unknown[]) {
    return _original.call(createProxy(this, request, reply), request, reply, ...rest);
  };
}

function createProxy(target: any, request: unknown, reply: unknown): any {
  return new Proxy(target, {
    get(target, p) {
      const value = target[p];

      if (p === FASTIFY_REQUEST || value === FASTIFY_REQUEST) return request;
      if (p === FASTIFY_REPLY || value === FASTIFY_REPLY) return reply;

      if (hasServiceInjection(value)) {
        return new Proxy(value, {
          get(injectedService, prop) {
            if (prop === FASTIFY_REQUEST || injectedService[prop] === FASTIFY_REQUEST) return request;
            if (prop === FASTIFY_REPLY || injectedService[prop] === FASTIFY_REPLY) return reply;
            if (typeof injectedService[prop] === 'function') return injectedService[prop].bind(createProxy(injectedService, request, reply));

            return injectedService[prop];
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
}
