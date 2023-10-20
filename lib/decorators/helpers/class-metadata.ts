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

export function getHandlerContainerMetadata(metadata: DecoratorMetadata | undefined): Container<IHandler> {
  return getContainerFromMetadata(null, metadata as Record<symbol, Container<unknown>>, HANDLERS);
}

export function getHooksContainerMetadata(metadata: DecoratorMetadata | undefined): Container<IHook> {
  return getContainerFromMetadata(null, metadata as Record<symbol, Container<unknown>>, HOOKS);
}

export function getErrorHandlerContainerMetadata(metadata: DecoratorMetadata | undefined): Container<IErrorHandler> {
  return getContainerFromMetadata(null, metadata as Record<symbol, Container<unknown>>, ERROR_HANDLERS);
}

function getContainerFromMetadata<T, Type>(target: T | null, metadata: Record<symbol, Container<unknown>>, name: symbol): Container<Type> {
  const base = (target ? (target as new () => unknown).prototype.__proto__?.constructor?.[METADATA]?.[name] : undefined) as Container<Type>;

  if (!Object.prototype.hasOwnProperty.call(metadata, name)) {
    Reflect.defineProperty(metadata, name, {
      value: new Container(base),
      enumerable: false,
      configurable: false,
      writable: false,
    });
  } else if (target) {
    const container = metadata[name as keyof typeof metadata] as Container<Type>;
    container.setParent(base);
  }

  return metadata[name as keyof typeof metadata] as Container<Type>;
}

function getContainer<T extends object, Type>(target: T, name: symbol): Container<Type> {
  const metadata = getMetadata(target);
  return getContainerFromMetadata<T, Type>(target, metadata, name);
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
