import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller } from 'fastify-decorators';
import { Inject } from '@fastify-decorators/simple-di';
import { BaseEndpoints } from './base-endpoints.js';
import { InjectableAsyncService } from './injectable-async-service.js';
import { InjectableService, injectableServiceToken } from './injectable.service.js';
import { GET } from 'fastify-decorators';

@Controller('/dependency-injection/inject')
export default class InjectController extends BaseEndpoints {
  @Inject(InjectableAsyncService)
  protected _injectableAsyncService!: InjectableAsyncService;

  @Inject(InjectableService)
  protected _injectableService!: InjectableService;

  @Inject(injectableServiceToken)
  private _injectableByTokenService!: InjectableService;

  @GET('/sync/v2')
  getSyncV2(request: FastifyRequest, reply: FastifyReply): void {
    reply.send(this._injectableByTokenService.getMessage());
  }
}
