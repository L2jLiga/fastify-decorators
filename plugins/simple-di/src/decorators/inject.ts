/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { SERVICE_INJECTION } from '../symbols.js';
import { ensureServiceInjection } from './helpers/ensure-service-injection.js';

/**
 * Property decorator to inject dependencies
 * @param name of service to inject
 *
 * @example
 * class Service {
 *     @Inject('instance')
 *     private instance: FastifyInstance;
 * }
 */
export function Inject(name: string | symbol | unknown): PropertyDecorator {
  return (target, propertyKey) => {
    ensureServiceInjection(target);

    target[SERVICE_INJECTION].push({ propertyKey, name });
  };
}
