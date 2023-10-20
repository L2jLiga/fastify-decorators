/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import type { IErrorHandler } from '../interfaces/index.js';
import type { Constructable } from '../plugins/index.js';
import { getErrorHandlerContainer } from '../plugins/index.js';
import { getErrorHandlerContainerMetadata } from './helpers/class-metadata.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ErrorHandler(): <This = unknown, Value extends (this: This, ...args: any) => any = (this: This, ...args: any) => any>(
  target: Value | This,
  ctx: ClassMethodDecoratorContext<This, Value> | ClassFieldDecoratorContext<This, Value> | string | symbol,
) => void;
export function ErrorHandler(
  code: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): <This = unknown, Value extends (this: This, ...args: any) => any = (this: This, ...args: any) => any>(
  target: Value | This,
  ctx: ClassMethodDecoratorContext<This, Value> | ClassFieldDecoratorContext<This, Value> | string | symbol,
) => void;
export function ErrorHandler<T extends Error>(
  configuration: Constructable<T>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): <This = unknown, Value extends (this: This, ...args: any) => any = (this: This, ...args: any) => any>(
  target: Value | This,
  ctx: ClassMethodDecoratorContext<This, Value> | ClassFieldDecoratorContext<This, Value> | string | symbol,
) => void;
export function ErrorHandler<T extends ErrorConstructor>(
  configuration: T,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): <This = unknown, Value extends (this: This, ...args: any) => any = (this: This, ...args: any) => any>(
  target: Value | This,
  ctx: ClassMethodDecoratorContext<This, Value> | ClassFieldDecoratorContext<This, Value> | string | symbol,
) => void;
export function ErrorHandler<T extends ErrorConstructor>(
  parameter?: T | string | null | undefined,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): <This = unknown, Value extends (this: This, ...args: any) => any = (this: This, ...args: any) => any>(
  target: Value | This,
  ctx: ClassMethodDecoratorContext<This, Value> | ClassFieldDecoratorContext<This, Value> | string | symbol,
) => void {
  return function (target, handlerName) {
    if (typeof handlerName === 'object' && 'kind' in handlerName) {
      const container = getErrorHandlerContainerMetadata(handlerName.metadata);

      if (parameter == null) {
        container.push(handlerFactory(() => true, handlerName.name));
      } else if (typeof parameter === 'string') {
        container.push(handlerFactory((error?: ErrorWithCode) => error?.code === parameter, handlerName.name));
      } else {
        container.push(handlerFactory((error?: Error) => error instanceof parameter, handlerName.name));
      }
    } else {
      const container = getErrorHandlerContainer((target as abstract new () => unknown).constructor);

      if (parameter == null) {
        container.push(handlerFactory(() => true, handlerName));
      } else if (typeof parameter === 'string') {
        container.push(handlerFactory((error?: ErrorWithCode) => error?.code === parameter, handlerName));
      } else {
        container.push(handlerFactory((error?: Error) => error instanceof parameter, handlerName));
      }
    }
  };
}

interface ErrorWithCode extends Error {
  code?: string;
}

function handlerFactory(accepts: <T extends Error>(error?: T) => boolean, handlerName: string | symbol): IErrorHandler {
  return { accepts, handlerName };
}
