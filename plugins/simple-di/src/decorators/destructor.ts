/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { DESTRUCTOR } from '../symbols.js';

export function Destructor(): PropertyDecorator {
  return (targetPrototype: any, propertyKey: string | symbol): void => {
    const target = targetPrototype.constructor;

    target[DESTRUCTOR] = propertyKey;
  };
}
