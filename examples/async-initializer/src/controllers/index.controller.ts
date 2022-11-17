import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, Inject } from 'fastify-decorators';

import { ServiceA } from '../services/ServiceA.js';
import { ServiceB } from '../services/ServiceB.js';

@Controller('/')
export default class IndexController {
  @Inject(ServiceA)
  private serviceA!: ServiceA;

  @Inject(ServiceB)
  private serviceB!: ServiceB;

  @GET('/')
  async getToken(_: FastifyRequest, reply: FastifyReply): Promise<void> {
    this.serviceA.sayHello();
    this.serviceB.sayHello();

    reply.send({
      status: 'ok',
    });
  }
}
