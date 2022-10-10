/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { IErrorHandler, IHandler, IHook } from '../../interfaces/controller.js';
import { ERROR_HANDLERS, HANDLERS, HOOKS, SERVICE_INJECTION } from '../../symbols/index.js';
import { ServiceInjection } from './inject-dependencies.js';
import { Container } from './container.js';

export function ensureHandlers(target: { [HANDLERS]?: Container<IHandler> }): asserts target is { [HANDLERS]: Container<IHandler> } {
  if (!Object.prototype.hasOwnProperty.call(target, HANDLERS)) {
    Reflect.defineProperty(target, HANDLERS, {
      value: new Container(target[HANDLERS]),
      enumerable: false,
      configurable: false,
      writable: false,
    });
  }
}

export function hasHandlers<Constructor>(target: Constructor): target is Constructor & { [HANDLERS]: Container<IHandler> } {
  return HANDLERS in target;
}

export function ensureErrorHandlers(target: { [ERROR_HANDLERS]?: Container<IErrorHandler> }): asserts target is { [ERROR_HANDLERS]: Container<IErrorHandler> } {
  if (!Object.prototype.hasOwnProperty.call(target, ERROR_HANDLERS)) {
    Reflect.defineProperty(target, ERROR_HANDLERS, {
      value: new Container(target[ERROR_HANDLERS]),
      enumerable: false,
      configurable: false,
      writable: false,
    });
  }
}

export function hasErrorHandlers<T>(target: T): target is T & { [ERROR_HANDLERS]: Container<IErrorHandler> } {
  return ERROR_HANDLERS in target;
}

export function ensureHooks(target: { [HOOKS]?: Container<IHook> }): asserts target is { [HOOKS]: Container<IHook> } {
  if (!Object.prototype.hasOwnProperty.call(target, HOOKS)) {
    Reflect.defineProperty(target, HOOKS, {
      value: new Container(target[HOOKS]),
      enumerable: false,
      configurable: false,
      writable: false,
    });
  }
}

export function hasHooks<T>(target: T): target is T & { [HOOKS]: Container<IHook> } {
  return HOOKS in target;
}

export function ensureServiceInjection(target: {
  [SERVICE_INJECTION]?: Container<ServiceInjection>;
}): asserts target is { [SERVICE_INJECTION]: Container<ServiceInjection> } {
  if (!Object.prototype.hasOwnProperty.call(target, SERVICE_INJECTION)) {
    Reflect.defineProperty(target, SERVICE_INJECTION, {
      value: new Container(target[SERVICE_INJECTION]),
      enumerable: false,
      configurable: false,
      writable: false,
    });
  }
}

export function hasServiceInjection<T>(val: T): val is T & { [SERVICE_INJECTION]: Container<ServiceInjection> } {
  return SERVICE_INJECTION in val;
}
