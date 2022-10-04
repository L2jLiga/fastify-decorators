import { Inject, FastifyRequestToken, FastifyReplyToken, Service } from 'fastify-decorators';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Nested2Service } from './Nested2Service.js';

@Service()
export class Nested1Service {
  @Inject(FastifyRequestToken)
  request!: FastifyRequest;

  @Inject(FastifyReplyToken)
  reply!: FastifyReply;

  constructor(private nested: Nested2Service) {}

  replyWithHttp() {
    this.reply.status(200).send(this.request.method);
  }

  replyFromNested() {
    this.nested.replyWithHttp();
  }

  replyFromNested2() {
    this.nested.replyFromNested();
  }
}
