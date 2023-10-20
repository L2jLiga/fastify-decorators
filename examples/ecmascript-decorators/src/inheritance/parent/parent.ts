import { GET } from 'fastify-decorators';

export class Parent {
  declare message: string;

  @GET('/ping')
  async ping() {
    return 'pong!';
  }

  @GET('/ping-ping')
  async pingPing() {
    return this.message;
  }
}
