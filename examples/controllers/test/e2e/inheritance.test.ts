import { app } from '../../src/index.js';

describe('Controllers inheritance test', () => {
  for (const prefix of ['abstract', 'parent'])
    describe(`${prefix}`, () => {
      it('should reply on ping request to inherited controller', async () => {
        const response = await app.inject(`/${prefix}/inherited/ping`);

        expect(response.payload).toBe('pong!');
      });

      it('should inherit parent routes when controller has own methods', async () => {
        const response = await app.inject(`/${prefix}/own-methods/ping`);

        expect(response.payload).toBe('pong!');
      });

      it('should reply on ping-ping request with message from inherited controller', async () => {
        const response = await app.inject(`/${prefix}/inherited/ping-ping`);

        expect(response.payload).toBe('Inherited');
      });

      it('should reply on own methods from inherited controller', async () => {
        const response = await app.inject(`/${prefix}/own-methods/pong`);

        expect(response.payload).toBe('PING!');
      });

      it('should not affect other derivatives', async () => {
        const response = await app.inject(`/${prefix}/inherited/pong`);

        expect(response.statusCode).toBe(404);
      });
    });
});
