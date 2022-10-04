import { FastifyReplyToken, FastifyRequestToken, Inject, Service } from 'fastify-decorators';
import { FastifyReply, FastifyRequest } from 'fastify';

@Service()
export class ServiceWithRequestReply {
  @Inject(FastifyRequestToken)
  private request!: FastifyRequest;

  @Inject(FastifyReplyToken)
  private reply!: FastifyReply;

  replyWithHttpMethod(): void {
    this.reply.status(200).send(this.request.method);
  }
}
