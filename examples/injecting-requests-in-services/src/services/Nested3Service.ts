import { Inject, FastifyRequestToken, FastifyReplyToken, Service } from '@fastify-decorators/simple-di';
import { FastifyReply, FastifyRequest } from 'fastify';

@Service()
export class Nested3Service {
  @Inject(FastifyRequestToken)
  request!: FastifyRequest;

  @Inject(FastifyReplyToken)
  reply!: FastifyReply;

  replyWithHttp() {
    this.reply.status(200).send(this.request.method);
  }
}
