import { GET, Hook, RequestHandler } from 'fastify-decorators';

@GET('/hook')
class HookHandler extends RequestHandler {
  handle(): void {
    this.reply.status(204).send();
  }

  @Hook('onSend')
  async setPoweredBy(): Promise<void> {
    this.reply.header('X-Powered-By', 'RequestHandler');
  }
}

module.exports = HookHandler;
