/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { FastifyInstance } from 'fastify';
import { ensureErrorHandlers, ensureHandlers, ensureHooks } from '../decorators/helpers/class-properties.js';
import { injectControllerOptions } from '../decorators/helpers/inject-controller-options.js';
import { ControllerTypeStrategies } from '../decorators/strategies/controller-type.js';
import { IErrorHandler, IHandler, IHook, InjectableController } from '../interfaces/index.js';
import { Injectables } from '../interfaces/injectable-class.js';
import { ControllerType } from '../registry/controller-type.js';
import { injectables } from '../registry/injectables.js';
import { CREATOR, ERROR_HANDLERS, HANDLERS, HOOKS, INJECTABLES } from '../symbols/index.js';

/**
 * @experimental this API is not stable and can change in future
 */
export { InjectableController, Injectables, IHandler, IHook, IErrorHandler };

/**
 * @experimental this API is not stable and can change in future
 *
 * @param route on which controller should be available
 * @param decorateFn
 */
export function decorateController(
  route: string,
  decorateFn: (target: InjectableController, instance: FastifyInstance, injectablesMap: Injectables) => void,
): ClassDecorator {
  return (target) => {
    injectControllerOptions(target);

    target[CREATOR].register = async (instance: FastifyInstance, injectablesMap = injectables, cacheResult = true) => {
      target[INJECTABLES] = injectablesMap;
      target.prototype[INJECTABLES] = injectablesMap;

      decorateFn(target, instance, injectablesMap);

      await instance.register(async (instance) => ControllerTypeStrategies[ControllerType.SINGLETON](instance, target, injectablesMap, cacheResult), {
        prefix: route,
      });
    };
  };
}

/**
 * @experimental this API is not stable and can change in future
 *
 * @param target
 * @param handler
 */
export function addHandler(target: Record<keyof unknown, unknown>, handler: IHandler): void {
  ensureHandlers(target);
  target[HANDLERS].push(handler);
}

/**
 * @experimental this API is not stable and can change in future
 *
 * @param target
 * @param hook
 */
export function addHook(target: Record<keyof unknown, unknown>, hook: IHook): void {
  ensureHooks(target);
  target[HOOKS].push(hook);
}

/**
 * @experimental this API is not stable and can change in future
 *
 * @param target
 * @param errorHandler
 */
export function addErrorHandler(target: Record<keyof unknown, unknown>, errorHandler: IErrorHandler): void {
  ensureErrorHandlers(target);
  target[ERROR_HANDLERS].push(errorHandler);
}
