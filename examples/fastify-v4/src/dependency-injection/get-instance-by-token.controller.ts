import { Controller, GET, getInstanceByToken } from 'fastify-decorators';
import { InjectableAsyncService } from './injectable-async-service.js';
import { InjectableService, injectableServiceToken } from './injectable.service.js';

@Controller('/dependency-injection/get-instance-by-token')
export default class GetInstanceByTokenController {
  private _injectableAsyncService = getInstanceByToken<InjectableAsyncService>(InjectableAsyncService);
  private _injectableService = getInstanceByToken<InjectableService>(InjectableService);
  private _injectableByTokenService = getInstanceByToken<InjectableService>(injectableServiceToken);

  @GET('/sync')
  async getSync(): Promise<string> {
    return this._injectableService.getMessage();
  }

  @GET('/sync/v2')
  async getSyncV2(): Promise<string> {
    return this._injectableByTokenService.getMessage();
  }

  @GET('/async')
  async getAsync(): Promise<string> {
    return this._injectableAsyncService.getMessage();
  }
}
