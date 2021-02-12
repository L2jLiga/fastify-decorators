import { deepStrictEqual, strictEqual } from 'assert';
import { describe, it } from 'mocha';
import { app } from '../../src/app.js';

describe('States controllers tests', () => {
  it('Stateful controller should save state', async () => {
    const initialState = await app.inject('/stateful');
    const setStateReq = await app.inject({ method: 'POST', url: '/stateful', payload: { newState: true } });
    const newState = await app.inject('/stateful');

    deepStrictEqual(initialState.json(), {});
    strictEqual(setStateReq.statusCode, 201);
    deepStrictEqual(newState.json(), { newState: true });
  });

  it('Stateless controller should not save state', async () => {
    const initialState = await app.inject('/stateless');
    const setStateReq = await app.inject({ method: 'POST', url: '/stateless', payload: { newState: true } });
    const newState = await app.inject('/stateless');

    deepStrictEqual(initialState.json(), {});
    strictEqual(setStateReq.statusCode, 201);
    deepStrictEqual(newState.json(), {});
  });
});
