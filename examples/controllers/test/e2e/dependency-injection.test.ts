import { AddressInfo } from 'net';
import Undici from 'undici';
import { app } from '../../src/index.js';

const fetch = Undici.fetch;

describe('Controllers dependency injection tests', () => {
  beforeAll(() => app.listen());
  afterAll(() => app.close());

  const getAppOrigin = () => `http://localhost:${(app.server.address() as AddressInfo).port}`;

  describe('Controller with constructor', () => {
    it('should work with sync service', async () => {
      const response = await fetch(`${getAppOrigin()}/dependency-injection/using-constructor/sync`);

      expect(response.status).toEqual(200);
      expect(await response.text()).toEqual('Message');
    });

    it('should work with async service', async () => {
      const response = await fetch(`${getAppOrigin()}/dependency-injection/using-constructor/async`);

      expect(response.status).toEqual(200);
      expect(await response.text()).toEqual('Message');
    });
  });

  describe('Controller with @Inject decorator', () => {
    it('should work with sync service', async () => {
      const response = await fetch(`${getAppOrigin()}/dependency-injection/inject/sync`);

      expect(response.status).toEqual(200);
      expect(await response.text()).toEqual('Message');
    });

    it('should work with service injected by token', async () => {
      const response = await fetch(`${getAppOrigin()}/dependency-injection/inject/sync/v2`);

      expect(response.status).toEqual(200);
      expect(await response.text()).toEqual('Message');
    });

    it('should work with async service', async () => {
      const response = await fetch(`${getAppOrigin()}/dependency-injection/inject/async`);

      expect(response.status).toEqual(200);
      expect(await response.text()).toEqual('Message');
    });
  });

  describe('Controller with getInstanceByToken call', () => {
    it('should work with sync service', async () => {
      const response = await fetch(`${getAppOrigin()}/dependency-injection/get-instance-by-token/sync`);

      expect(response.status).toEqual(200);
      expect(await response.text()).toEqual('Message');
    });

    it('should work with service injected by token', async () => {
      const response = await fetch(`${getAppOrigin()}/dependency-injection/get-instance-by-token/sync/v2`);

      expect(response.status).toEqual(200);
      expect(await response.text()).toEqual('Message');
    });

    it('should work with async service', async () => {
      const response = await fetch(`${getAppOrigin()}/dependency-injection/get-instance-by-token/async`);

      expect(response.status).toEqual(200);
      expect(await response.text()).toEqual('Message');
    });
  });
});
