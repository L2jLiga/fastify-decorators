import { GET, Hook, RequestHandler } from 'fastify-decorators';

@GET('/hook')
export default class HookHandler extends RequestHandler {
  handle(): void {
    this.reply.status(204).send();
  }

  @Hook('onRequest')
  async setPoweredBy(): Promise<void> {
    this.reply.header('X-Powered-By', 'RequestHandler');
  }
}
