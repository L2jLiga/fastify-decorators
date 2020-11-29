import { Controller } from 'fastify-decorators';
import { Inject } from 'fastify-decorators';
import { InjectableAsyncService } from './injectable-async-service';
import { InjectableService, injectableServiceToken } from './injectable.service';
import { GET } from 'fastify-decorators';

@Controller('/dependency-injection/inject')
export default class InjectController {
  @Inject(InjectableAsyncService)
  private _injectableAsyncService!: InjectableAsyncService;

  @Inject(InjectableService)
  private _injectableService!: InjectableService;

  @Inject(injectableServiceToken)
  private _injectableByTokenService!: InjectableService;

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
