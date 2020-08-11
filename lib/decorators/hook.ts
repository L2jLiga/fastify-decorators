/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { HOOKS } from '../symbols';
import { ensureHooks } from './helpers/class-properties';

/**
 * Creates handler which listen various hooks
 */
export function Hook(name: string): MethodDecorator {
    return ({ constructor }: any, handlerName: string | symbol) => {
        ensureHooks(constructor);

        constructor[HOOKS].push({
            name,
            handlerName
        });
    };
}
