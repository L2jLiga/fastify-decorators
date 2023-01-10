/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { createInitializationHook } from 'fastify-decorators/plugins';
import { destructors } from '../registry/destructors.js';
import { DESTRUCTOR } from '../symbols.js';

createInitializationHook('appDestroy', () => Promise.all([...destructors].map(([, destructor]) => destructor())));

export function Destructor(): PropertyDecorator {
  return (targetPrototype: any, propertyKey: string | symbol): void => {
    const target = targetPrototype.constructor;

    target[DESTRUCTOR] = propertyKey;
  };
}
