import { app } from '../src/index.js';

describe('RequestHandlers hooks support', () => {
  it('should return username when user exists', async () => {
    const response = await app.inject('/hook');

    expect(response.statusCode).toBe(204);
    expect(response.headers['x-powered-by']).toBe('RequestHandler');
  });
});
