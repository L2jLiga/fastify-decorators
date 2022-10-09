import { getInstanceByToken } from '@fastify-decorators/simple-di';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET } from 'fastify-decorators';
import { BaseEndpoints } from './base-endpoints.js';
import { InjectableAsyncService } from './injectable-async-service.js';
import { InjectableService, injectableServiceToken } from './injectable.service.js';

@Controller('/dependency-injection/get-instance-by-token')
export default class GetInstanceByTokenController extends BaseEndpoints {
  protected _injectableAsyncService = getInstanceByToken<InjectableAsyncService>(InjectableAsyncService);
  protected _injectableService = getInstanceByToken<InjectableService>(InjectableService);
  private _injectableByTokenService = getInstanceByToken<InjectableService>(injectableServiceToken);

  @GET('/sync/v2')
  getSyncV2(request: FastifyRequest, reply: FastifyReply): void {
    reply.send(this._injectableByTokenService.getMessage());
  }
}
