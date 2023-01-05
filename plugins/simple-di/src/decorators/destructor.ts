/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { CLASS_LOADER, createInitializationHook } from 'fastify-decorators/plugins';
import { destructors } from '../registry/destructors.js';
import { DESTRUCTOR } from '../symbols.js';
import { defaultScope } from '../utils/dependencies-scope-manager.js';

createInitializationHook('appDestroy', (fastifyInstance) =>
  Promise.all([...destructors].map(([Service, property]) => fastifyInstance[CLASS_LOADER]<typeof Service>(Service, defaultScope)[property]())),
);

export function Destructor(): PropertyDecorator {
  return (targetPrototype: any, propertyKey: string | symbol): void => {
    const target = targetPrototype.constructor;

    target[DESTRUCTOR] = propertyKey;
  };
}
