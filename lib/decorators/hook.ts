/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { ControllerConstructor } from '../interfaces';
import { CONTROLLER } from '../symbols';
import { injectDefaultControllerOptions } from './helpers/inject-controller-options';

export function Hook(name: string) {
    return (target: any, handlerName: string) => {
        injectDefaultControllerOptions(target.constructor)

        const controllerOpts = (<ControllerConstructor>target.constructor)[CONTROLLER];

        controllerOpts.hooks.push({
            name,
            handlerName
        });
    };
}