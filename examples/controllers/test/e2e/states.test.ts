import { app } from '../../src';

describe('States controllers tests', () => {
  it('Stateful controller should save state', async () => {
    const initialState = await app.inject('/stateful');
    const setStateReq = await app.inject({ method: 'POST', url: '/stateful', payload: { newState: true } });
    const newState = await app.inject('/stateful');

    expect(initialState.json()).toEqual({});
    expect(setStateReq.statusCode).toEqual(201);
    expect(newState.json()).toEqual({ newState: true });
  });

  it('Stateless controller should not save state', async () => {
    const initialState = await app.inject('/stateless');
    const setStateReq = await app.inject({ method: 'POST', url: '/stateless', payload: { newState: true } });
    const newState = await app.inject('/stateless');

    expect(initialState.json()).toEqual({});
    expect(setStateReq.statusCode).toEqual(201);
    expect(newState.json()).toEqual({});
  });
});
