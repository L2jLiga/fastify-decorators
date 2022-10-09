import { AddressInfo } from 'net';
import { fetch } from 'undici';
import { app } from '../../src/index.js';

describe('States controllers tests', () => {
  beforeAll(() => app.listen());
  afterAll(() => app.close());

  const getAppOrigin = () => `http://localhost:${(app.server.address() as AddressInfo).port}`;

  it('Stateful controller should save state', async () => {
    const initialState = await fetch(`${getAppOrigin()}/stateful`);
    const setStateReq = await fetch(`${getAppOrigin()}/stateful`, {
      method: 'POST',
      body: JSON.stringify({ newState: true }),
      headers: { 'content-type': 'application/json' },
    });
    const newState = await fetch(`${getAppOrigin()}/stateful`);

    expect(await initialState.json()).toEqual({});
    expect(setStateReq.status).toEqual(201);
    expect(await newState.json()).toEqual({ newState: true });
  });

  it('Stateless controller should not save state', async () => {
    const initialState = await fetch(`${getAppOrigin()}/stateless`);
    const setStateReq = await fetch(`${getAppOrigin()}/stateless`, {
      method: 'POST',
      body: JSON.stringify({ newState: true }),
      headers: { 'content-type': 'application/json' },
    });
    const newState = await fetch(`${getAppOrigin()}/stateless`);

    expect(await initialState.json()).toEqual({});
    expect(setStateReq.status).toEqual(201);
    expect(await newState.json()).toEqual({});
  });
});
