import { GET } from 'fastify-decorators';

export abstract class AbstractParent {
  abstract message: string;

  @GET('/ping')
  async ping() {
    return 'pong!';
  }

  @GET('/ping-ping')
  async pingPing() {
    return this.message;
  }
}
