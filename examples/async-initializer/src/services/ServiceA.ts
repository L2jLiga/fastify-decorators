import { Initializer, Inject, Service } from '@fastify-decorators/simple-di';
import { MessagesHolder } from './MessagesHolder.js';

@Service()
export class ServiceA {
  protected name = 'ServiceA';

  @Inject(MessagesHolder)
  private holder!: MessagesHolder;

  @Initializer()
  public async init(): Promise<void> {
    this.holder.add('ServiceA::init()');
  }

  public sayHello(name = this.name): void {
    this.holder.add(`Hello from service ${name}`);
  }
}
