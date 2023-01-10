/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { Constructable } from 'fastify-decorators/plugins/index.js';
import { SERVICE_INJECTION } from '../../symbols.js';
import { Container } from '../../utils/container.js';
import { ServiceInjection } from './inject-dependencies.js';

export function ensureServiceInjection<T>(
  val: T & {
    [SERVICE_INJECTION]?: Container<ServiceInjection>;
  },
): asserts val is T & {
  [SERVICE_INJECTION]: Container<ServiceInjection>;
} {
  if (!(val[SERVICE_INJECTION] && Object.prototype.hasOwnProperty.call(val, SERVICE_INJECTION))) {
    Reflect.defineProperty(val, SERVICE_INJECTION, {
      value: new Container(val[SERVICE_INJECTION]),
      enumerable: false,
      configurable: false,
      writable: false,
    });
  }
}

export function hasServiceInjection<T>(val: T): val is T & Constructable & { [SERVICE_INJECTION]: Container<ServiceInjection> } {
  return (typeof val === 'function' || (typeof val === 'object' && val !== null)) && SERVICE_INJECTION in val;
}
