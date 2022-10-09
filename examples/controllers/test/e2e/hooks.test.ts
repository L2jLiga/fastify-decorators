import { AddressInfo } from 'net';
import { app } from '../../src/index.js';
import { fetch } from 'undici';

describe('Controllers hooks tests', () => {
  beforeAll(() => app.listen());
  afterAll(() => app.close());

  for (const type of ['Stateful', 'Stateless']) {
    it(`${type} controller should support hooks`, async () => {
      const response = await fetch(`http://localhost:${(app.server.address() as AddressInfo).port}/${type.toLowerCase()}/hooks`);

      expect(response.headers.get('x-powered-by')).toEqual('Tell me who');
    });
  }
});
