import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, Hook, Scope } from 'fastify-decorators';

@Controller({
  route: '/stateful/hooks',
  scope: Scope.SINGLETON,
})
export default class StatefulController {
  @GET()
  async getStateful(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    reply.status(204);
  }

  @Hook('onSend')
  async setPoweredBy(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    reply.header('X-Powered-By', 'Tell me who');
  }
}
