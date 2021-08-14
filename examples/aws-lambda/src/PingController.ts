import { Inject } from '@fastify-decorators/simple-di';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET } from 'fastify-decorators';
import { PingService } from './PingService.js';

@Controller('/ping')
export class PingController {
  @Inject(PingService)
  pingService!: PingService;

  @GET('/async')
  async handleAsync(): Promise<{ message: string }> {
    return this.pingService.pong();
  }

  @GET('/sync')
  handleSync(request: FastifyRequest, reply: FastifyReply): void {
    this.pingService.pong().then(reply.send.bind(reply), reply.send.bind(reply));
  }
}
