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
} from 'fastify';
import { CREATOR } from '../symbols/index.js';

/**
 * Abstract class which should extend all decorated request handlers
 */
export abstract class RequestHandler<
  RawServer extends RawServerBase = RawServerDefault,
  RawRequest extends RawRequestDefaultExpression<RawServer> = RawRequestDefaultExpression<RawServer>,
  RawReply extends RawReplyDefaultExpression<RawServer> = RawReplyDefaultExpression<RawServer>,
  RequestGeneric extends RequestGenericInterface = RequestGenericInterface,
  ContextConfig = ContextConfigDefault
> {
  protected constructor(
    protected request: FastifyRequest<RequestGeneric, RawServer, RawRequest>,
    protected reply: FastifyReply<RawServer, RawRequest, RawReply, RequestGeneric, ContextConfig>,
  ) {}

  /**
   * Main method for request handling
   */
  abstract handle(): void | Promise<unknown>;

  /**
   * Static method to register handler by autoloader (bootstrap)
   */
  static readonly [CREATOR]: { register: (instance: FastifyInstance) => void };
}

export interface RequestHook {
  name: 'onRequest' | 'preParsing' | 'preValidation' | 'preHandler' | 'preSerialization' | 'onSend' | 'onResponse' | 'onTimeout' | 'onError';
  handlerName: string | symbol;
}
