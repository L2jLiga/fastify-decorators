import { DELETE, ErrorHandler, RequestHandler } from 'fastify-decorators';
import { users } from './user.js';
import { UserError } from './user-error.js';

@DELETE('/user/:username')
export default class DeleteUserHandler extends RequestHandler {
  public handle(): void {
    const { username } = this.request.params as Record<string, string>;
    if (!users.has(username)) throw new UserError('USER_NOT_FOUND');

    users.delete(username);
    this.reply.status(204).send();
  }

  @ErrorHandler('USER_NOT_FOUND')
  public notExists(): void {
    this.reply.status(404).send({ message: 'User not found' });
  }
}
