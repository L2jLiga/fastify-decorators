import { strictEqual } from 'assert';
import { describe, it } from 'mocha';
import { app } from '../../src/app.js';

describe('Controllers hooks tests', () => {
  it('Stateful controller should support hooks', async () => {
    const initialState = await app.inject('/stateful/hooks');

    strictEqual(initialState.headers['x-powered-by'], 'Tell me who');
  });

  it('Stateless controller should support hooks', async () => {
    const initialState = await app.inject('/stateless/hooks');

    strictEqual(initialState.headers['x-powered-by'], 'Tell me who');
  });
});
