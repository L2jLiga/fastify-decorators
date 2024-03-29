import { AddressInfo } from 'net';
import Undici from 'undici';
import { app } from '../../src/index.js';

const request = Undici.request;

describe('Controllers inheritance test', () => {
  beforeAll(() => app.listen());
  afterAll(() => app.close());

  const getAppOrigin = () => `http://localhost:${(app.server.address() as AddressInfo).port}`;

  for (const prefix of ['abstract', 'parent'])
    describe(`${prefix}`, () => {
      it('should reply on ping request to inherited controller', async () => {
        const response = await request(`${getAppOrigin()}/${prefix}/inherited/ping`);

        expect(await response.body.text()).toBe('pong!');
      });

      it('should inherit parent routes when controller has own methods', async () => {
        const response = await request(`${getAppOrigin()}/${prefix}/own-methods/ping`);

        expect(await response.body.text()).toBe('pong!');
      });

      it('should reply on ping-ping request with message from inherited controller', async () => {
        const response = await request(`${getAppOrigin()}/${prefix}/inherited/ping-ping`);

        expect(await response.body.text()).toBe('Inherited');
      });

      it('should reply on own methods from inherited controller', async () => {
        const response = await request(`${getAppOrigin()}/${prefix}/own-methods/pong`);

        expect(await response.body.text()).toBe('PING!');
      });

      it('should not affect other derivatives', async () => {
        const response = await request(`${getAppOrigin()}/${prefix}/inherited/pong`);

        expect(response.statusCode).toBe(404);
      });
    });
});
