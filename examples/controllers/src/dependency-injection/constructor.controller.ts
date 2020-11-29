import { Controller, GET } from 'fastify-decorators';
import { InjectableAsyncService } from './injectable-async-service';
import { InjectableService } from './injectable.service';

@Controller('/dependency-injection/constructor')
export default class ConstructorController {
  constructor(private _injectableAsyncService: InjectableAsyncService, private _injectableService: InjectableService) {}

  @GET('/sync')
  async getSync(): Promise<string> {
    return this._injectableService.getMessage();
  }

  @GET('/async')
  async getAsync(): Promise<string> {
    return this._injectableAsyncService.getMessage();
  }
}
