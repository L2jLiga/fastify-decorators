import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, ControllerType, GET, Hook } from 'fastify-decorators';

@Controller({
  route: '/stateless/hooks',
  type: ControllerType.REQUEST,
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
