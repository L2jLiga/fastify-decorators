import { Controller, GET } from 'fastify-decorators';
import { BaseEndpoints } from './base-endpoints.js';
import { InjectableAsyncService } from './injectable-async-service.js';
import { InjectableService } from './injectable.service.js';
import { ServiceWithRequestReply } from './service-with-request-reply.js';

@Controller('/dependency-injection/using-constructor')
export default class ConstructorController extends BaseEndpoints {
  constructor(
    protected _injectableAsyncService: InjectableAsyncService,
    protected _injectableService: InjectableService,
    private _serviceWithContext: ServiceWithRequestReply,
  ) {
    super();
  }

  @GET('/method')
  replyWithHttpMethod(): void {
    this._serviceWithContext.replyWithHttpMethod();
  }
}
