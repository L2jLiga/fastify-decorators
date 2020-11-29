import { app } from '../../src';

describe('Controllers dependency injection tests', () => {
  describe('Controller with constructor', () => {
    it('should work with sync service', async () => {
      const initialState = await app.inject('/dependency-injection/constructor/sync');

      expect(initialState.statusCode).toEqual(200);
      expect(initialState.body).toEqual('Message');
    });

    it('should work with async service', async () => {
      const initialState = await app.inject('/dependency-injection/constructor/async');

      expect(initialState.statusCode).toEqual(200);
      expect(initialState.body).toEqual('Message');
    });
  });

  describe('Controller with @Inject decorator', () => {
    it('should work with sync service', async () => {
      const initialState = await app.inject('/dependency-injection/inject/sync');

      expect(initialState.statusCode).toEqual(200);
      expect(initialState.body).toEqual('Message');
    });

    it('should work with service injected by token', async () => {
      const initialState = await app.inject('/dependency-injection/inject/sync/v2');

      expect(initialState.statusCode).toEqual(200);
      expect(initialState.body).toEqual('Message');
    });

    it('should work with async service', async () => {
      const initialState = await app.inject('/dependency-injection/inject/async');

      expect(initialState.statusCode).toEqual(200);
      expect(initialState.body).toEqual('Message');
    });
  });

  describe('Controller with getInstanceByToken call', () => {
    it('should work with sync service', async () => {
      const initialState = await app.inject('/dependency-injection/get-instance-by-token/sync');

      expect(initialState.statusCode).toEqual(200);
      expect(initialState.body).toEqual('Message');
    });

    it('should work with service injected by token', async () => {
      const initialState = await app.inject('/dependency-injection/get-instance-by-token/sync/v2');

      expect(initialState.statusCode).toEqual(200);
      expect(initialState.body).toEqual('Message');
    });

    it('should work with async service', async () => {
      const initialState = await app.inject('/dependency-injection/get-instance-by-token/async');

      expect(initialState.statusCode).toEqual(200);
      expect(initialState.body).toEqual('Message');
    });
  });
});
