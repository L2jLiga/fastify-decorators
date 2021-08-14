import { Service } from '@fastify-decorators/simple-di';

export const injectableServiceToken = Symbol('InjectableService');

@Service(injectableServiceToken)
export class InjectableService {
  private _message = 'Message';

  getMessage(): string {
    return this._message;
  }
}
