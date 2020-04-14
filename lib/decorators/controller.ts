/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { ControllerConfig, ControllerConstructor } from '../interfaces';
import { ControllerType } from '../registry';
import { injectables } from '../registry/injectables';
import { CREATOR, INJECTABLES } from '../symbols';
import { injectDefaultControllerOptions } from './helpers/inject-controller-options';
import { ControllerTypeStrategies } from './strategies/controller-type';

function makeConfig(config?: string | ControllerConfig): ControllerConfig {
    if (typeof config === 'string') config = { route: config };

    return { type: ControllerType.SINGLETON, route: '/', ...config };
}

/**
 * Creates register method on controller to allow bootstrap it
 */
export function Controller(): ClassDecorator;
export function Controller(route: string): ClassDecorator;
export function Controller(config: ControllerConfig): ClassDecorator;
export function Controller(config?: string | ControllerConfig) {
    return <T extends any>(controller: T): void => {
        const { route, type } = makeConfig(config);

        injectDefaultControllerOptions(controller);

        (<ControllerConstructor><any>controller)[CREATOR].register = (instance, injectablesMap = injectables, cacheResult = true) => {
            controller[INJECTABLES] = injectablesMap;
            controller.prototype[INJECTABLES] = injectablesMap;
            return instance.register(async instance => ControllerTypeStrategies[type!](instance, <any>controller, injectablesMap, cacheResult), { prefix: route });
        };
    };
}
