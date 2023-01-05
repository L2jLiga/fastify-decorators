/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { CLASS_LOADER, createInitializationHook } from 'fastify-decorators/plugins';
import { Constructable } from 'fastify-decorators/plugins/index.js';
import type { Container as TypeDIContainer, ServiceOptions } from 'typedi';

export function useContainer(Container: typeof TypeDIContainer) {
  createInitializationHook('appInit', (fastifyInstance) => fastifyInstance.decorate(CLASS_LOADER, (target: Constructable) => Container.get(target)));
  createInitializationHook('beforeControllerCreation', (fastifyInstance, target) => {
    const controllerMetadata: ServiceOptions = {
      id: target,
      type: target,
    };

    Container.set(controllerMetadata);
  });
}
