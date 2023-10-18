/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { IErrorHandler, IHandler, IHook } from '../../interfaces/index.js';
import { Constructable } from '../../plugins/index.js';
import { ERROR_HANDLERS, HANDLERS, HOOKS } from '../../symbols/index.js';
import { Container } from './container.js';

export function ensureHandlers<T extends object>(target: T): asserts target is T & { [HANDLERS]: Container<IHandler> } {
  if (!(HANDLERS in target && target[HANDLERS] && Object.prototype.hasOwnProperty.call(target, HANDLERS))) {
    Reflect.defineProperty(target, HANDLERS, {
      value: new Container((target as unknown as Record<typeof HANDLERS, Container<IHandler>>)[HANDLERS]),
      enumerable: false,
      configurable: false,
      writable: false,
    });
  }
}

export function hasHandlers<Class extends Constructable>(target: Class): target is Class & { [HANDLERS]: Container<IHandler> } {
  return HANDLERS in target;
}

export function ensureErrorHandlers<T extends object>(target: T): asserts target is T & { [ERROR_HANDLERS]: Container<IErrorHandler> } {
  if (!(ERROR_HANDLERS in target && target[ERROR_HANDLERS] && Object.prototype.hasOwnProperty.call(target, ERROR_HANDLERS))) {
    Reflect.defineProperty(target, ERROR_HANDLERS, {
      value: new Container((target as unknown as Record<typeof ERROR_HANDLERS, Container<IErrorHandler>>)[ERROR_HANDLERS]),
      enumerable: false,
      configurable: false,
      writable: false,
    });
  }
}

export function hasErrorHandlers<Class extends Constructable>(target: Class): target is Class & { [ERROR_HANDLERS]: Container<IErrorHandler> } {
  return ERROR_HANDLERS in target;
}

export function ensureHooks<T extends object>(target: T): asserts target is T & { [HOOKS]: Container<IHook> } {
  if (!(HOOKS in target && target[HOOKS] && Object.prototype.hasOwnProperty.call(target, HOOKS))) {
    Reflect.defineProperty(target, HOOKS, {
      value: new Container((target as unknown as Record<typeof HOOKS, Container<IHook>>)[HOOKS]),
      enumerable: false,
      configurable: false,
      writable: false,
    });
  }
}

export function hasHooks<Class extends Constructable>(target: Class): target is Class & { [HOOKS]: Container<IHook> } {
  return HOOKS in target;
}
