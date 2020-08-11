/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { ErrorHandler, Handler, Hook } from '../../interfaces';
import { ERROR_HANDLERS, HANDLERS, HOOKS } from '../../symbols';

export function ensureHandlers(val: any): asserts val is { [HANDLERS]: Handler[] } {
    if (!(HANDLERS in val)) {
        val[HANDLERS] = [];
    }
}

export function hasHandlers<T>(val: T): val is T & { [HANDLERS]: Handler[] } {
    return HANDLERS in val;
}

export function ensureErrorHandlers(val: any): asserts val is { [ERROR_HANDLERS]: ErrorHandler[] } {
    if (!(ERROR_HANDLERS in val)) {
        val[ERROR_HANDLERS] = [];
    }
}

export function hasErrorHandlers<T>(val: T): val is T & { [ERROR_HANDLERS]: ErrorHandler[] } {
    return ERROR_HANDLERS in val;
}

export function ensureHooks(val: any): asserts val is { [HOOKS]: Hook[] } {
    if (!(HOOKS in val)) {
        val[HOOKS] = [];
    }
}

export function hasHooks<T>(val: T): val is T & { [HOOKS]: Hook[] } {
    return HOOKS in val;
}
