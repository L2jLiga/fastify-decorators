import { ErrorHandler, GET, RequestHandler } from 'fastify-decorators';
import { schema, users } from './user';
import { UserError } from './user-error';

@GET('/user/:username', { schema })
export default class GetUserHandler extends RequestHandler {
  public handle(): Promise<{ username: string }> {
    const { username } = this.request.params as Record<string, string>;
    if (!users.has(username)) throw new UserError('USER_NOT_FOUND');

    return Promise.resolve({ username });
  }

  @ErrorHandler('USER_NOT_FOUND')
  public notExists(): void {
    this.reply.status(404).send({ message: 'User not found' });
  }
}
