import { Controller, GET } from 'fastify-decorators';
import { InjectableService } from './injectable.service.js';
import { Inject } from 'typedi';

@Controller('/type-di')
export default class TypeDIController {
  @Inject()
  private _injectableService!: InjectableService;

  @GET()
  async getSync(): Promise<string> {
    return this._injectableService.getMessage();
  }
}
