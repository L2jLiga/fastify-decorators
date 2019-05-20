/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { ControllerConfig, ControllerConstructor } from '../interfaces';
import { CONTROLLER } from '../symbols';
import { getDefaultControllerOptions } from './helpers/default-controller-options';

export function Controller(config: ControllerConfig) {
    return <T extends any>(controller: T) => {
        if (!(<ControllerConstructor><any>controller)[CONTROLLER]) {
            (<ControllerConstructor><any>controller)[CONTROLLER] = getDefaultControllerOptions();
        }

        (<ControllerConstructor><any>controller)[CONTROLLER].register = (instance) => {
            instance.register(async (instance) => {
                const configuration = (<ControllerConstructor><any>controller)[CONTROLLER];

                configuration.handlers.forEach(handler => {
                    instance[handler.method](handler.url, handler.options, (request, reply) => new controller()[handler.handlerMethod](request, reply));
                });
            }, {prefix: config.route});
        };

        return controller;
    };
}