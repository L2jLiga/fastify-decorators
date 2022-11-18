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

export function ensureHandlers(target: { [HANDLERS]?: Container<IHandler> }): asserts target is { [HANDLERS]: Container<IHandler> } {
  if (!Object.prototype.hasOwnProperty.call(target, HANDLERS)) {
    Reflect.defineProperty(target, HANDLERS, {
      value: new Container(target[HANDLERS] as Container<IHandler>),
      enumerable: false,
      configurable: false,
      writable: false,
    });
  }
}

export function hasHandlers<Class extends Constructable>(target: Class): target is Class & { [HANDLERS]: Container<IHandler> } {
  return HANDLERS in target;
}

export function ensureErrorHandlers(target: { [ERROR_HANDLERS]?: Container<IErrorHandler> }): asserts target is { [ERROR_HANDLERS]: Container<IErrorHandler> } {
  if (!Object.prototype.hasOwnProperty.call(target, ERROR_HANDLERS)) {
    Reflect.defineProperty(target, ERROR_HANDLERS, {
      value: new Container(target[ERROR_HANDLERS] as Container<IErrorHandler>),
      enumerable: false,
      configurable: false,
      writable: false,
    });
  }
}

export function hasErrorHandlers<Class extends Constructable>(target: Class): target is Class & { [ERROR_HANDLERS]: Container<IErrorHandler> } {
  return ERROR_HANDLERS in target;
}

export function ensureHooks(target: { [HOOKS]?: Container<IHook> }): asserts target is { [HOOKS]: Container<IHook> } {
  if (!Object.prototype.hasOwnProperty.call(target, HOOKS)) {
    Reflect.defineProperty(target, HOOKS, {
      value: new Container(target[HOOKS] as Container<IHook>),
      enumerable: false,
      configurable: false,
      writable: false,
    });
  }
}

export function hasHooks<Class extends Constructable>(target: Class): target is Class & { [HOOKS]: Container<IHook> } {
  return HOOKS in target;
}
