import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, DELETE, ErrorHandler, GET, POST } from 'fastify-decorators';
import { schema, users } from './user.js';
import { UserError } from './user-error.js';

@Controller('/user')
export default class UserController {
  @GET('/:username', { schema })
  public getUser(request: FastifyRequest<{ Params: { username: string } }>, reply: FastifyReply): void {
    const { username } = request.params;
    if (!users.has(username)) throw new UserError('USER_NOT_FOUND');

    reply.send({ username });
  }

  @DELETE('/:username')
  public deleteUser(request: FastifyRequest<{ Params: { username: string } }>, reply: FastifyReply): void {
    const { username } = request.params;
    if (!users.has(username)) throw new UserError('USER_NOT_FOUND');

    users.delete(username);
    reply.status(204).send();
  }

  @POST('/', { schema })
  public createUser(request: FastifyRequest<{ Body: { username: string } }>, reply: FastifyReply): void {
    const { username } = request.body;
    if (users.has(username)) throw new UserError('USER_ALREADY_EXISTS');

    reply.status(200).send({ username });
  }

  @ErrorHandler('USER_ALREADY_EXISTS')
  userExists(error: Error, request: FastifyRequest, reply: FastifyReply): void {
    reply.status(422).send({ message: 'User already exists' });
  }

  @ErrorHandler('USER_NOT_FOUND')
  public notExists(error: Error, request: FastifyRequest, reply: FastifyReply): void {
    reply.status(404).send({ message: 'User not found' });
  }
}
