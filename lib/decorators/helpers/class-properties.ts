/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import type { ErrorHandler, Handler, Hook } from '../../interfaces';
import { ERROR_HANDLERS, HANDLERS, HOOKS, SERVICE_INJECTION } from '../../symbols';
import { ServiceInjection } from './inject-dependencies';

export function ensureHandlers(val: { [HANDLERS]?: Handler[] }): asserts val is { [HANDLERS]: Handler[] } {
    if (!(HANDLERS in val)) {
        Reflect.defineProperty(val, HANDLERS, {
            value: [],
            enumerable: false,
            configurable: false,
            writable: false,
        });
    }
}

export function hasHandlers<T>(val: T): val is T & { [HANDLERS]: Handler[] } {
    return HANDLERS in val;
}

export function ensureErrorHandlers(val: { [ERROR_HANDLERS]?: ErrorHandler[] }): asserts val is { [ERROR_HANDLERS]: ErrorHandler[] } {
    if (!(ERROR_HANDLERS in val)) {
        Reflect.defineProperty(val, ERROR_HANDLERS, {
            value: [],
            enumerable: false,
            configurable: false,
            writable: false,
        });
    }
}

export function hasErrorHandlers<T>(val: T): val is T & { [ERROR_HANDLERS]: ErrorHandler[] } {
    return ERROR_HANDLERS in val;
}

export function ensureHooks(val: { [HOOKS]?: Hook[] }): asserts val is { [HOOKS]: Hook[] } {
    if (!(HOOKS in val)) {
        Reflect.defineProperty(val, HOOKS, {
            value: [],
            enumerable: false,
            configurable: false,
            writable: false,
        });
    }
}

export function hasHooks<T>(val: T): val is T & { [HOOKS]: Hook[] } {
    return HOOKS in val;
}

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
