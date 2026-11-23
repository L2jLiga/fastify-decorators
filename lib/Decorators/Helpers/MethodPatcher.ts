import { ERROR_HANDLERS, FASTIFY_REPLY, FASTIFY_REQUEST, HANDLERS, HOOKS, SERVICE_INJECTION } from '../../Symbols/index.js';
import {ClassPropsHelper} from "./index.js";
import { Constructor } from './index.js';


export function patchMethods<C>(constructor: Constructor<C>): void {
  patchHandlers(constructor);
  patchErrorsHandlers(constructor);
  patchHooks(constructor);
}

function patchHandlers<C>(constructor: Constructor<C>): void {
  if (ClassPropsHelper.hasHandlers(constructor)){
    for (const it of constructor[HANDLERS]) patchMethod(constructor, it.handlerMethod);
  }
}

function patchErrorsHandlers<C>(constructor: Constructor<C>): void {
  if (ClassPropsHelper.hasErrorHandlers(constructor)){
    for (const it of constructor[ERROR_HANDLERS]) patchMethod(constructor, it.handlerName);
  }
}

function patchHooks<C>(constructor: Constructor<C>): void {
  if (ClassPropsHelper.hasHooks(constructor)){
    for (const it of constructor[HOOKS]) patchMethod(constructor, it.handlerName);
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

      if (ClassPropsHelper.hasServiceInjection(value)) return createProxy(value, request, reply);

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
