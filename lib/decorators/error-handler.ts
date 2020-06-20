/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { ControllerConstructor, ErrorHandler } from '../interfaces';
import { CREATOR } from '../symbols';
import { injectDefaultControllerOptions } from './helpers/inject-controller-options';
import { Constructor } from './helpers/inject-dependencies';

export function ErrorHandler(): MethodDecorator;
export function ErrorHandler(code: string): MethodDecorator;
export function ErrorHandler<T extends Error>(configuration: Constructor<T>): MethodDecorator;

export function ErrorHandler<T extends ErrorConstructor>(parameter?: T | string): MethodDecorator {
    return function (target: any, handlerName: string | symbol) {
        injectDefaultControllerOptions(target.constructor);
        const controllerOpts = (<ControllerConstructor>target.constructor)[CREATOR];

        if (parameter == null) {
            controllerOpts.errorHandlers.push(handlerFactory(() => true, handlerName));
        } else if (typeof parameter === 'string') {
            controllerOpts.errorHandlers.push(handlerFactory((error?: ErrorWithCode) => error?.code === parameter, handlerName));
        } else {
            controllerOpts.errorHandlers.push(handlerFactory((error?: Error) => error instanceof parameter, handlerName));
        }
    };
}

interface ErrorWithCode extends Error {
    code?: string;
}

function handlerFactory(accepts: <T extends Error>(error?: T) => boolean, handlerName: string | symbol): ErrorHandler {
    return { accepts, handlerName };
}
