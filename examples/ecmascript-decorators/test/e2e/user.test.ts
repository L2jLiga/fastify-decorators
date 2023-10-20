import { AddressInfo } from 'net';
import Undici from 'undici';
import { app } from '../../src/index.js';
import { users } from '../../src/user/user.js';

const request = Undici.request;

describe('User feature', () => {
  beforeAll(() => app.listen());
  afterAll(() => app.close());
  afterEach(() => users.clear());

  const getAppOrigin = () => `http://localhost:${(app.server.address() as AddressInfo).port}`;

  it('should return username when user exists', async () => {
    users.add('Player');

    const response = await request(`${getAppOrigin()}/user/Player`);
    const body = await response.body.json();

    expect(body).toEqual({ username: 'Player' });
  });

  it('should return 404 error when user does exist', async () => {
    const response = await request(`${getAppOrigin()}/user/Player`);
    const body = await response.body.json();

    expect(response.statusCode).toBe(404);
    expect(body).toEqual({ message: 'User not found' });
  });

  it('should delete existing user', async () => {
    users.add('User');

    const response = await request(`${getAppOrigin()}/user/User`, { method: 'DELETE' });
    const body = await response.body.text();

    expect(response.statusCode).toBe(204);
    expect(body).toBe('');
  });

  it('should return 404 when deleting not existing user', async () => {
    const response = await request(`${getAppOrigin()}/user/User`, { method: 'DELETE' });
    const body = await response.body.json();

    expect(response.statusCode).toBe(404);
    expect(body).toEqual({ message: 'User not found' });
  });

  it('should return username when creating user', async () => {
    const response = await request(`${getAppOrigin()}/user`, {
      method: 'POST',
      body: JSON.stringify({
        username: 'David',
        age: 19,
        region: 'Msk',
      }),
      headers: { 'content-type': 'application/json' },
    });
    const body = await response.body.json();

    expect(body).toEqual({ username: 'David' });
  });

  it('should return unprocessable entity error when new user name is busy', async () => {
    users.add('David');

    const response = await request(`${getAppOrigin()}/user`, {
      method: 'POST',
      body: JSON.stringify({
        username: 'David',
        age: 19,
        region: 'Msk',
      }),
      headers: { 'content-type': 'application/json' },
    });
    const body = await response.body.json();

    expect(response.statusCode).toBe(422);
    expect(body).toEqual({ message: 'User already exists' });
  });
});
