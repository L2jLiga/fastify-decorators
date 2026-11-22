/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import type { IErrorHandler } from '../../Interfaces/index.js';
import { ERROR_HANDLERS } from '../../Symbols/index.js';
import { Constructor,ClassPropsHelper } from '../Helpers/index.js';

export function ErrorHandler(): PropertyDecorator;
export function ErrorHandler(code: string): PropertyDecorator;
export function ErrorHandler<T extends Error>(configuration: Constructor<T>): PropertyDecorator;
export function ErrorHandler<T extends ErrorConstructor>(parameter?: T | string): PropertyDecorator {
  return function ({ constructor }: any, handlerName: string | symbol) {
    ClassPropsHelper.ensureErrorHandlers(constructor);

    if (parameter == null) {
      constructor[ERROR_HANDLERS].push(handlerFactory(() => true, handlerName));
    } else if (typeof parameter === 'string') {
      constructor[ERROR_HANDLERS].push(handlerFactory((error?: ErrorWithCode) => error?.code === parameter, handlerName));
    } else {
      constructor[ERROR_HANDLERS].push(handlerFactory((error?: Error) => error instanceof parameter, handlerName));
    }
  };
}

interface ErrorWithCode extends Error {
  code?: string;
}

function handlerFactory(accepts: <T extends Error>(error?: T) => boolean, handlerName: string | symbol): IErrorHandler {
  return { accepts, handlerName };
}
