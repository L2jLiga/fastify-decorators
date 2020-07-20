/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { CREATOR } from '../symbols';
import { injectDefaultControllerOptions } from './helpers/inject-controller-options';

/**
 * Creates handler which listen various hooks
 */
export function Hook(name: string): MethodDecorator {
    return ({ constructor }: any, handlerName: string | symbol) => {
        injectDefaultControllerOptions(constructor);

        const controllerOpts = constructor[CREATOR];

        controllerOpts.hooks.push({
            name,
            handlerName
        });
    };
}
