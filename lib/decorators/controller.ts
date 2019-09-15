/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { ControllerConfig, ControllerConstructor } from '../interfaces';
import { ControllerType } from '../registry';
import { CONTROLLER, TYPE } from '../symbols';
import { injectDefaultControllerOptions } from './helpers/inject-controller-options';
import { ControllerTypeStrategies } from './strategies/controller-type';

/**
 * Creates register method on controller to allow bootstrap it
 */
export function Controller(config: ControllerConfig) {
    return <T extends any>(controller: T) => {
        const type: ControllerType = config.type || ControllerType.SINGLETON;

        injectDefaultControllerOptions(controller);

        controller[TYPE] = CONTROLLER;
        (<ControllerConstructor><any>controller)[CONTROLLER].register = (instance) => {
            instance.register(async instance => ControllerTypeStrategies[type](instance, <any>controller), { prefix: config.route });
        };

        return controller;
    };
}
