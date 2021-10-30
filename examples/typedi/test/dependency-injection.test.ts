import { app } from '../src/index.js';

describe('Controllers dependency injection tests', () => {
  it('should work with sync service', async () => {
    const initialState = await app.inject('/type-di');

    expect(initialState.statusCode).toEqual(200);
    expect(initialState.body).toEqual('Message');
  });
});
