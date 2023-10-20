/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { getHooksContainer } from './helpers/class-metadata.js';

/**
 * Creates handler which listen various hooks
 */
export function Hook(name: string): PropertyDecorator {
  return ({ constructor }, handlerName) => {
    const container = getHooksContainer(constructor);

    container.push({
      name,
      handlerName,
    });
  };
}
