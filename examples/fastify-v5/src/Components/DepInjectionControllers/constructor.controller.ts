import { Controller, GET } from 'fastify-decorators';
import { InjectableAsyncService } from './injectable-async-service.js';
import { InjectableService } from './injectable.service.js';

@Controller('/dependency-injection/using-constructor')
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
