import { deepStrictEqual, strictEqual } from 'assert';
import { app } from '../../src/app.js';
import { users } from '../../src/user/user.js';

describe('User feature', () => {
  afterEach(() => users.clear());

  it('should return username when user exists', async () => {
    users.add('Player');
    const response = await app.inject('/user/Player');

    deepStrictEqual(response.json(), { username: 'Player' });
  });

  it('should return 404 error when user does exist', async () => {
    const response = await app.inject('/user/Player');

    strictEqual(response.statusCode, 404);
    deepStrictEqual(response.json(), { message: 'User not found' });
  });

  it('should delete existing user', async () => {
    users.add('User');
    const response = await app.inject({
      url: '/user/User',
      method: 'DELETE',
    });

    strictEqual(response.statusCode, 204);
    deepStrictEqual(response.payload, '');
  });

  it('should return 404 when deleting not existing user', async () => {
    const response = await app.inject({
      url: '/user/User',
      method: 'DELETE',
    });

    strictEqual(response.statusCode, 404);
    deepStrictEqual(response.json(), { message: 'User not found' });
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

    deepStrictEqual(response.json(), { username: 'David' });
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

    strictEqual(response.statusCode, 422);
    deepStrictEqual(response.json(), { message: 'User already exists' });
  });
});
