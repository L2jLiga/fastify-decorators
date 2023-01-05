import { Inject } from '@fastify-decorators/simple-di';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET } from 'fastify-decorators';
import { MessagesHolder } from '../services/MessagesHolder.js';

import { ServiceA } from '../services/ServiceA.js';
import { ServiceB } from '../services/ServiceB.js';

@Controller('/')
export default class IndexController {
  @Inject(ServiceA)
  private serviceA!: ServiceA;

  @Inject(ServiceB)
  private serviceB!: ServiceB;

  @Inject(MessagesHolder)
  declare messages: MessagesHolder;

  @GET('/')
  async getToken(_: FastifyRequest, reply: FastifyReply): Promise<void> {
    this.serviceA.sayHello();
    this.serviceB.sayHello();

    reply.send({
      status: 'ok',
    });
  }
}
