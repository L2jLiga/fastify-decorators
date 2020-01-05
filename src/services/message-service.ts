import { Service } from 'fastify-decorators';

@Service()
export class MessageService {
    private _message = 'Service works!';

    public getMessage() {
        return this._message;
    }
}
