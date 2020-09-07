/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import type { FastifyInstance, RouteShorthandOptions } from 'fastify';
import type { FastifyLoggerInstance } from 'fastify/types/logger';
import type { RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerBase, RawServerDefault } from 'fastify/types/utils';
import type { HttpMethods } from '../decorators/helpers/http-methods';
import type { CREATOR } from '../symbols';

export interface ControllerConstructor<RawServer extends RawServerBase = RawServerDefault,
    RawRequest extends RawRequestDefaultExpression<RawServer> = RawRequestDefaultExpression<RawServer>,
    RawReply extends RawReplyDefaultExpression<RawServer> = RawReplyDefaultExpression<RawServer>,
    Logger = FastifyLoggerInstance> {

    new(): any;

    new(...args: unknown[]): any;

    [CREATOR]: ControllerHandlersAndHooks<RawServer, RawRequest, RawReply>;
}

export interface ControllerHandlersAndHooks<RawServer extends RawServerBase,
    RawRequest extends RawRequestDefaultExpression<RawServer>,
    RawReply extends RawReplyDefaultExpression<RawServer>> {
    register?: (instance: FastifyInstance<RawServer, RawRequest, RawReply>) => void;
}

export interface Handler {
    url: string;
    method: HttpMethods;
    options: RouteShorthandOptions;
    handlerMethod: string | symbol;
}

export interface ErrorHandler {
    accepts<T extends Error>(error?: T): boolean;

    handlerName: string | symbol;
}

export interface Hook {
    name: any;
    handlerName: string | symbol;
}
