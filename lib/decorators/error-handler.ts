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

export function ErrorHandler(): PropertyDecorator;
export function ErrorHandler(code: string): PropertyDecorator;
export function ErrorHandler<T extends Error>(configuration: Constructable<T>): PropertyDecorator;
export function ErrorHandler<T extends ErrorConstructor>(configuration: T): PropertyDecorator;
export function ErrorHandler<T extends ErrorConstructor>(parameter?: T | string | null | undefined): PropertyDecorator {
  return function ({ constructor }, handlerName) {
    const container = getErrorHandlerContainer(constructor);

    if (parameter == null) {
      container.push(handlerFactory(() => true, handlerName));
    } else if (typeof parameter === 'string') {
      container.push(handlerFactory((error?: ErrorWithCode) => error?.code === parameter, handlerName));
    } else {
      container.push(handlerFactory((error?: Error) => error instanceof parameter, handlerName));
    }
  };
}

interface ErrorWithCode extends Error {
  code?: string;
}

function handlerFactory(accepts: <T extends Error>(error?: T) => boolean, handlerName: string | symbol): IErrorHandler {
  return { accepts, handlerName };
}
