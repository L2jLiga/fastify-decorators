import { IErrorHandler, IHandler, IHook } from '../../interfaces/index.js';
import { ERROR_HANDLERS, HANDLERS, HOOKS, METADATA } from '../../symbols/index.js';
import { Container } from './container.js';

// TODO: Support for ES Decorators
export function getHandlersContainer<T extends object>(target: T): Container<IHandler> {
  return getContainer(target, HANDLERS);
}

export function getHooksContainer<T extends object>(target: T): Container<IHook> {
  return getContainer(target, HOOKS);
}

export function getErrorHandlerContainer<T extends object>(target: T): Container<IErrorHandler> {
  return getContainer(target, ERROR_HANDLERS);
}

/// Internal

function getContainer<T extends object, Type>(target: T, name: symbol): Container<Type> {
  const metadata = getMetadata(target);
  const base = (target as new () => unknown).prototype.__proto__?.constructor?.[METADATA]?.[name] as Container<Type>;

  if (!Object.prototype.hasOwnProperty.call(metadata, name)) {
    Reflect.defineProperty(metadata, name, {
      value: new Container(base),
      enumerable: false,
      configurable: false,
      writable: false,
    });
  }

  return metadata[name as keyof typeof metadata] as Container<Type>;
}

function getMetadata<T extends object>(target: T): Record<symbol, Container<unknown>> {
  ensureMetadata(target);
  return target[METADATA];
}

function ensureMetadata<T extends object>(target: T): asserts target is T & { [METADATA]: Record<symbol, Container<unknown>> } {
  if (!Object.prototype.hasOwnProperty.call(target, METADATA)) {
    Reflect.defineProperty(target, METADATA, {
      value: {},
      enumerable: false,
      configurable: false,
      writable: false,
    });
  }
}
