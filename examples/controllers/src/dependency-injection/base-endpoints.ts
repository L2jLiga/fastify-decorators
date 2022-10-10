import { FastifyReply, FastifyRequest } from 'fastify';
import { GET } from 'fastify-decorators';
import { InjectableAsyncService } from './injectable-async-service.js';
import { InjectableService } from './injectable.service.js';

export abstract class BaseEndpoints {
  protected abstract _injectableAsyncService: InjectableAsyncService;
  protected abstract _injectableService: InjectableService;

  @GET('/sync')
  getSync(request: FastifyRequest, reply: FastifyReply): void {
    reply.send(this._injectableService.getMessage());
  }

  @GET('/async')
  async getAsync(): Promise<string> {
    return this._injectableAsyncService.getMessage();
  }
}
