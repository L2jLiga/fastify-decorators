import type {
  ContextConfigDefault,
  FastifyReply,
  FastifyRequest,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerBase,
  RawServerDefault,
  RequestGenericInterface,
} from 'fastify';

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
  constructor(
    protected request: FastifyRequest<RequestGeneric, RawServer, RawRequest>,
    protected reply: FastifyReply<RequestGeneric, RawServer, RawRequest, RawReply, ContextConfig>,
  ) {}

  /**
   * Main method for request handling
   */
  abstract handle(): void | Promise<unknown>;
}
