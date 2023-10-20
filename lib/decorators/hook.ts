/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { getHooksContainer, getHooksContainerMetadata } from './helpers/class-metadata.js';

/**
 * Creates handler which listen various hooks
 */
export function Hook(
  name: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): <This = unknown, Value extends (this: This, ...args: any) => any = (this: This, ...args: any) => any>(
  target: Value | This,
  ctx: ClassMethodDecoratorContext<This, Value> | ClassFieldDecoratorContext<This, Value> | string | symbol,
) => void {
  return (target, handlerName) => {
    if (typeof handlerName === 'object' && 'kind' in handlerName) {
      const container = getHooksContainerMetadata(handlerName.metadata);
      container.push({
        name,
        handlerName: handlerName.name,
      });
    } else {
      const container = getHooksContainer((target as abstract new () => unknown).constructor);

      container.push({
        name,
        handlerName,
      });
    }
  };
}
