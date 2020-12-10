import { app } from '../../src/app.js';
import { users } from '../../src/user/user.js';
import chai from 'chai';

/* eslint-disable jest/valid-expect */
const { expect } = chai;

describe('User feature', () => {
  afterEach(() => users.clear());

  it('should return username when user exists', async () => {
    users.add('Player');
    const response = await app.inject('/user/Player');
    const body = response.json();

    expect(body).to.deep.equal({ username: 'Player' });
  });

  it('should return 404 error when user does exist', async () => {
    const response = await app.inject('/user/Player');
    const body = response.json();

    expect(response.statusCode).to.equal(404);
    expect(body).to.deep.equal({ message: 'User not found' });
  });

  it('should delete existing user', async () => {
    users.add('User');
    const response = await app.inject({
      url: '/user/User',
      method: 'DELETE',
    });
    const body = response.payload;

    expect(response.statusCode).to.equal(204);
    expect(body).to.equal('');
  });

  it('should return 404 when deleting not existing user', async () => {
    const response = await app.inject({
      url: '/user/User',
      method: 'DELETE',
    });
    const body = response.json();

    expect(response.statusCode).to.equal(404);
    expect(body).to.deep.equal({ message: 'User not found' });
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

    expect(body).to.deep.equal({ username: 'David' });
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

    expect(response.statusCode).to.equal(422);
    expect(body).to.deep.equal({ message: 'User already exists' });
  });
});
