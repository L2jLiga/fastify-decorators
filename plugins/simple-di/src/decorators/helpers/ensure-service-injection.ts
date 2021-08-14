import { SERVICE_INJECTION } from '../../symbols.js';
import { ServiceInjection } from './inject-dependencies.js';

export function ensureServiceInjection(val: { [SERVICE_INJECTION]?: ServiceInjection[] }): asserts val is { [SERVICE_INJECTION]: ServiceInjection[] } {
  if (!(SERVICE_INJECTION in val)) {
    Reflect.defineProperty(val, SERVICE_INJECTION, {
      value: [],
      enumerable: false,
      configurable: false,
      writable: false,
    });
  }
}

export function hasServiceInjection<T>(val: T): val is T & { [SERVICE_INJECTION]: ServiceInjection[] } {
  return SERVICE_INJECTION in val;
}
