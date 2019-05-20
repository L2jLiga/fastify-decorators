/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { ControllerConfig, ControllerConstructor } from '../interfaces';
import { CONTROLLER } from '../symbols';
import { injectDefaultControllerOptions } from './helpers/inject-controller-options';

export function Controller(config: ControllerConfig) {
    return <T extends any>(controller: T) => {
        injectDefaultControllerOptions(controller);

        (<ControllerConstructor><any>controller)[CONTROLLER].register = (instance) => {
            instance.register(async (instance) => {
                const controllerInstance = new controller;
                const configuration = (<ControllerConstructor><any>controller)[CONTROLLER];

                configuration.handlers.forEach(handler => {
                    instance[handler.method](handler.url, handler.options, (request, reply) => controllerInstance[handler.handlerMethod](request, reply));
                });

                configuration.hooks.forEach(hook => {
                    instance.addHook(hook.name, controllerInstance[hook.handlerName].bind(controllerInstance));
                });
            }, {prefix: config.route});
        };

        return controller;
    };
}
