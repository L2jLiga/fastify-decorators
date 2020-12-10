import { app } from '../../src/app.js';
import chai from 'chai';

/* eslint-disable jest/valid-expect */
const { expect } = chai;

describe('Controllers hooks tests', () => {
  it('Stateful controller should support hooks', async () => {
    const initialState = await app.inject('/stateful/hooks');

    expect(initialState.headers['x-powered-by']).to.equal('Tell me who');
  });

  it('Stateless controller should support hooks', async () => {
    const initialState = await app.inject('/stateless/hooks');

    expect(initialState.headers['x-powered-by']).to.equal('Tell me who');
  });
});
