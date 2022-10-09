import { AddressInfo } from 'net';
import Undici from 'undici';
import { app } from '../../src/index.js';
import { users } from '../../src/user/user.js';

const fetch = Undici.fetch;

describe('User feature', () => {
  beforeAll(() => app.listen());
  afterAll(() => app.close());
  afterEach(() => users.clear());

  const getAppOrigin = () => `http://localhost:${(app.server.address() as AddressInfo).port}`;

  it('should return username when user exists', async () => {
    users.add('Player');

    const response = await fetch(`${getAppOrigin()}/user/Player`);
    const body = await response.json();

    expect(body).toEqual({ username: 'Player' });
  });

  it('should return 404 error when user does exist', async () => {
    const response = await fetch(`${getAppOrigin()}/user/Player`);
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body).toEqual({ message: 'User not found' });
  });

  it('should delete existing user', async () => {
    users.add('User');

    const response = await fetch(`${getAppOrigin()}/user/User`, { method: 'DELETE' });
    const body = await response.text();

    expect(response.status).toBe(204);
    expect(body).toBe('');
  });

  it('should return 404 when deleting not existing user', async () => {
    const response = await fetch(`${getAppOrigin()}/user/User`, { method: 'DELETE' });
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body).toEqual({ message: 'User not found' });
  });

  it('should return username when creating user', async () => {
    const response = await fetch(`${getAppOrigin()}/user`, {
      method: 'POST',
      body: JSON.stringify({
        username: 'David',
        age: 19,
        region: 'Msk',
      }),
      headers: { 'content-type': 'application/json' },
    });
    const body = await response.json();

    expect(body).toEqual({ username: 'David' });
  });

  it('should return unprocessable entity error when new user name is busy', async () => {
    users.add('David');

    const response = await fetch(`${getAppOrigin()}/user`, {
      method: 'POST',
      body: JSON.stringify({
        username: 'David',
        age: 19,
        region: 'Msk',
      }),
      headers: { 'content-type': 'application/json' },
    });
    const body = await response.json();

    expect(response.status).toBe(422);
    expect(body).toEqual({ message: 'User already exists' });
  });
});
