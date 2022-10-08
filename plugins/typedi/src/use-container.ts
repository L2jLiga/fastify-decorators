/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { createInitializationHook } from 'fastify-decorators/plugins';
import type { Container as TypeDIContainer, ServiceOptions } from 'typedi';

export function useContainer(Container: typeof TypeDIContainer) {
  createInitializationHook('beforeControllerCreation', (fastifyInstance, target) => {
    const controllerMetadata: ServiceOptions = {
      id: target,
      type: target,
    };

    Container.set(controllerMetadata);
  });

  createInitializationHook('afterControllerCreation', (fastifyInstance, target, instance) => {
    Object.assign(instance as any, Container.get(target));
  });
}
