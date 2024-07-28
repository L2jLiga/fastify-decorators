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
  ContextConfig = ContextConfigDefault,
> {
  /**
   * Static method to register handler by autoloader (bootstrap)
   */
  static readonly [CREATOR]: { register: (instance: FastifyInstance) => void };

  protected constructor(
    protected request: FastifyRequest<RequestGeneric, RawServer, RawRequest>,
    protected reply: FastifyReply<RawServer, RawRequest, RawReply, RequestGeneric, ContextConfig>,
  ) {}

  /**
   * Main method for request handling
   */
  abstract handle(): void | Promise<unknown>;
}
