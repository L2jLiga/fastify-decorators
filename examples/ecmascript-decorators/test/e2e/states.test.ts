import { AddressInfo } from 'net';
import Undici from 'undici';
import { app } from '../../src/index.js';

const request = Undici.request;

describe('States controllers tests', () => {
  beforeAll(() => app.listen());
  afterAll(() => app.close());

  const getAppOrigin = () => `http://localhost:${(app.server.address() as AddressInfo).port}`;

  it('Stateful controller should save state', async () => {
    const initialState = await request(`${getAppOrigin()}/stateful`);
    const setStateReq = await request(`${getAppOrigin()}/stateful`, {
      method: 'POST',
      body: JSON.stringify({ newState: true }),
      headers: { 'content-type': 'application/json' },
    });
    const newState = await request(`${getAppOrigin()}/stateful`);

    expect(await initialState.body.json()).toEqual({});
    expect(setStateReq.statusCode).toEqual(201);
    expect(await newState.body.json()).toEqual({ newState: true });
  });

  it('Stateless controller should not save state', async () => {
    const initialState = await request(`${getAppOrigin()}/stateless`);
    const setStateReq = await request(`${getAppOrigin()}/stateless`, {
      method: 'POST',
      body: JSON.stringify({ newState: true }),
      headers: { 'content-type': 'application/json' },
    });
    const newState = await request(`${getAppOrigin()}/stateless`);

    expect(await initialState.body.json()).toEqual({});
    expect(setStateReq.statusCode).toEqual(201);
    expect(await newState.body.json()).toEqual({});
  });
});
