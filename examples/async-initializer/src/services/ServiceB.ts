import { Inject, Service } from 'fastify-decorators';
import { ServiceA } from './ServiceA.js';

@Service()
export class ServiceB {
  protected name = 'ServiceB';

  @Inject(ServiceA)
  private service!: ServiceA;

  public sayHello(): void {
    this.service.sayHello(this.name);
  }
}
