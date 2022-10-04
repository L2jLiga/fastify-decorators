import { Inject, FastifyRequestToken, FastifyReplyToken, Service } from 'fastify-decorators';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Nested3Service } from './Nested3Service.js';

@Service()
export class Nested2Service {
  @Inject(FastifyRequestToken)
  request!: FastifyRequest;

  @Inject(FastifyReplyToken)
  reply!: FastifyReply;

  constructor(private nested: Nested3Service) {}

  replyWithHttp() {
    this.reply.status(200).send(this.request.method);
  }

  replyFromNested() {
    this.nested.replyWithHttp();
  }
}
