import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, Hook, Scope } from 'fastify-decorators';

@Controller({
  route: '/stateless/hooks',
  scope: Scope.PER_REQUEST,
})
export default class StatelessController {
  @GET()
  async getStateless(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    reply.status(204);
  }

  @Hook('onSend')
  async setPoweredBy(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    reply.header('X-Powered-By', 'Tell me who');
  }
}
