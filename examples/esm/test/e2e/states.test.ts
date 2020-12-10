import { app } from '../../src/app.js';
import chai from 'chai';

/* eslint-disable jest/valid-expect */
const { expect } = chai;

describe('States controllers tests', () => {
  it('Stateful controller should save state', async () => {
    const initialState = await app.inject('/stateful');
    const setStateReq = await app.inject({ method: 'POST', url: '/stateful', payload: { newState: true } });
    const newState = await app.inject('/stateful');

    expect(initialState.json()).to.deep.equal({});
    expect(setStateReq.statusCode).to.equal(201);
    expect(newState.json()).to.deep.equal({ newState: true });
  });

  it('Stateless controller should not save state', async () => {
    const initialState = await app.inject('/stateless');
    const setStateReq = await app.inject({ method: 'POST', url: '/stateless', payload: { newState: true } });
    const newState = await app.inject('/stateless');

    expect(initialState.json()).to.deep.equal({});
    expect(setStateReq.statusCode).to.equal(201);
    expect(newState.json()).to.deep.equal({});
  });
});
