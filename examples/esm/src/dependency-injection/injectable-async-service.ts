import { Initializer, Service } from '@fastify-decorators/simple-di';

@Service()
export class InjectableAsyncService {
  private _message!: string;

  @Initializer()
  async init(): Promise<void> {
    this._message = await Promise.resolve('Message');
  }

  getMessage(): string {
    return this._message;
  }
}
