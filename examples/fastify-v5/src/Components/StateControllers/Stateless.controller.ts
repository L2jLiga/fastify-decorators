import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, ControllerType, GET, POST } from 'fastify-decorators';

type State = Record<string, unknown>;

@Controller({
  route: '/stateless',
  type: ControllerType.REQUEST,
})
export default class StatelessController {
  private state: State = {};

  @POST()
  setState(request: FastifyRequest<{ Body: State }>, reply: FastifyReply): void {
    this.state = request.body;
    reply.status(201).send();
  }

  @GET()
  getState(request: FastifyRequest, reply: FastifyReply): void {
    reply.status(200).send(this.state);
  }
}
