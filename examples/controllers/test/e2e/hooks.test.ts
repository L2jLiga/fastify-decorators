import { AddressInfo } from 'net';
import Undici from 'undici';
import { app } from '../../src/index.js';

const request = Undici.request;

describe('Controllers hooks tests', () => {
  beforeAll(() => app.listen());
  afterAll(() => app.close());

  for (const type of ['Stateful', 'Stateless']) {
    it(`${type} controller should support hooks`, async () => {
      const response = await request(`http://localhost:${(app.server.address() as AddressInfo).port}/${type.toLowerCase()}/hooks`);

      expect(response.headers['x-powered-by']).toEqual('Tell me who');
    });
  }
});
