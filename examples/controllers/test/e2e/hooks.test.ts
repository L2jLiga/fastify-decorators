import { app } from '../../src/index.js';

describe('Controllers hooks tests', () => {
  it('Stateful controller should support hooks', async () => {
    const initialState = await app.inject('/stateful/hooks');

    expect(initialState.headers['x-powered-by']).toEqual('Tell me who');
  });

  it('Stateless controller should support hooks', async () => {
    const initialState = await app.inject('/stateless/hooks');

    expect(initialState.headers['x-powered-by']).toEqual('Tell me who');
  });
});
