import { Service } from 'fastify-decorators';

export const injectableServiceToken = Symbol('InjectableService');

@Service(injectableServiceToken)
export class InjectableService {
    private _message = 'Message';

    getMessage(): string {
        return this._message;
    }
}
