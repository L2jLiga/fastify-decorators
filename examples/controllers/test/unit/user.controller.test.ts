import { FastifyInstance } from 'fastify';
import { configureControllerTest } from 'fastify-decorators/testing';
import { users } from '../../src/user/user';
import UserController from '../../src/user/user.controller';

describe('Controller: User', () => {
  let app: FastifyInstance;
  beforeEach(async () => {
    app = await configureControllerTest({
      controller: UserController,
    });
  });
  afterEach(() => users.clear());

  it('should return username when user exists', async () => {
    users.add('Player');
    const response = await app.inject('/user/Player');
    const body = response.json();

    expect(body).toEqual({ username: 'Player' });
  });

  it('should return 404 error when user does exist', async () => {
    const response = await app.inject('/user/Player');
    const body = response.json();

    expect(response.statusCode).toBe(404);
    expect(body).toEqual({ message: 'User not found' });
  });

  it('should delete existing user', async () => {
    users.add('User');
    const response = await app.inject({
      url: '/user/User',
      method: 'DELETE',
    });
    const body = response.payload;

    expect(response.statusCode).toBe(204);
    expect(body).toBe('');
  });

  it('should return 404 when deleting not existing user', async () => {
    const response = await app.inject({
      url: '/user/User',
      method: 'DELETE',
    });
    const body = response.json();

    expect(response.statusCode).toBe(404);
    expect(body).toEqual({ message: 'User not found' });
  });

  it('should return username when creating user', async () => {
    const response = await app.inject({
      url: '/user',
      method: 'POST',
      payload: {
        username: 'David',
        age: 19,
        region: 'Msk',
      },
    });
    const body = response.json();

    expect(body).toEqual({ username: 'David' });
  });

  it('should return unprocessable entity error when new user name is busy', async () => {
    users.add('David');
    const response = await app.inject({
      url: '/user',
      method: 'POST',
      payload: {
        username: 'David',
        age: 19,
        region: 'Msk',
      },
    });
    const body = response.json();

    expect(response.statusCode).toBe(422);
    expect(body).toEqual({ message: 'User already exists' });
  });
});
