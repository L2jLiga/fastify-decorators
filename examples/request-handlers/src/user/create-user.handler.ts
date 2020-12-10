import { ErrorHandler, POST, RequestHandler } from 'fastify-decorators';
import { schema, users } from './user.js';
import { UserError } from './user-error.js';

@POST('/user', { schema })
export default class CreateUserHandler extends RequestHandler {
  public handle(): void {
    const { username } = this.request.body as Record<string, string>;
    if (users.has(username)) throw new UserError('USER_ALREADY_EXISTS');

    this.reply.status(200).send(this.request.body);
  }

  @ErrorHandler('USER_ALREADY_EXISTS')
  userExists(): void {
    this.reply.status(422).send({ message: 'User already exists' });
  }
}
