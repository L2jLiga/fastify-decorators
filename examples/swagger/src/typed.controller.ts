import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, POST } from 'fastify-decorators';
import { schema, TBody } from './schemas.js';

@Controller({
  route: '/typed',
  tags: [{ name: 'Typed', description: 'Typed controller' }],
})
export class TypedController {
  @POST('/', { schema })
  public helloWorld(request: FastifyRequest<{ Body: TBody }>, reply: FastifyReply): void {
    reply.status(200).send({ message: request.body.message });
  }
}
