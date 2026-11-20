/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import type {
  ContextConfigDefault,
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerBase,
  RawServerDefault,
  RequestGenericInterface,
  RouteGenericInterface,
} from 'fastify';
import {LifecycleHook} from "fastify/types/hooks.js";
import { CREATOR } from '../symbols/index.js';

/**
 * Abstract class which should extend all decorated request handlers
 */
export abstract class RequestHandler<
  RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
  RawServer extends RawServerBase = RawServerDefault,
  RawRequest extends RawRequestDefaultExpression<RawServer> = RawRequestDefaultExpression<RawServer>,
  RawReply extends RawReplyDefaultExpression<RawServer> = RawReplyDefaultExpression<RawServer>,
  //RequestGeneric extends RequestGenericInterface = RequestGenericInterface,
  ContextConfig = ContextConfigDefault,
> {
  /**
   * Static method to register handler by autoloader (bootstrap)
   */
  static readonly [CREATOR]: { register: (instance: FastifyInstance) => void };

  protected constructor(
    protected request: FastifyRequest<RouteGeneric, RawServer, RawRequest>,
    protected reply: FastifyReply<
      RouteGeneric,
      RawServer, RawRequest, RawReply, 
      ContextConfig//,RequestGeneric
    >,
  ) {}

  /**
   * Main method for request handling
   */
  abstract handle(): void | Promise<unknown>;
}

export interface RequestHook {
  name: LifecycleHook;
  handlerName: string | symbol;
}
