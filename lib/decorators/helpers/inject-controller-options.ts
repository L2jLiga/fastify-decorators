/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { IncomingMessage, Server, ServerResponse } from 'http';
import { ControllerConstructor, ControllerHandlersAndHooks } from '../../interfaces';
import { CREATOR } from '../../symbols';

export function injectDefaultControllerOptions(controller: unknown): asserts controller is ControllerConstructor {
    if (controller instanceof Function) {
        if (!(CREATOR in controller)) {
            Object.defineProperty(controller, CREATOR, { value: getDefaultControllerOptions() });
        }

        return;
    }

    throw new Error('Invalid usage of @Controller decorator');
}

function getDefaultControllerOptions(): ControllerHandlersAndHooks<Server, IncomingMessage, ServerResponse> {
    return {
        handlers: [],
        errorHandlers: [],
        hooks: [],
    };
}
