import { strictEqual } from 'assert';
import { describe, it } from 'mocha';
import { app } from '../../src/app.js';

describe('Controllers dependency injection tests', () => {
  describe('Controller with constructor', () => {
    it('should work with sync service', async () => {
      const initialState = await app.inject('/dependency-injection/using-constructor/sync');

      strictEqual(initialState.statusCode, 200);
      strictEqual(initialState.body, 'Message');
    });

    it('should work with async service', async () => {
      const initialState = await app.inject('/dependency-injection/using-constructor/async');

      strictEqual(initialState.statusCode, 200);
      strictEqual(initialState.body, 'Message');
    });
  });

  describe('Controller with @Inject decorator', () => {
    it('should work with sync service', async () => {
      const initialState = await app.inject('/dependency-injection/inject/sync');

      strictEqual(initialState.statusCode, 200);
      strictEqual(initialState.body, 'Message');
    });

    it('should work with service injected by token', async () => {
      const initialState = await app.inject('/dependency-injection/inject/sync/v2');

      strictEqual(initialState.statusCode, 200);
      strictEqual(initialState.body, 'Message');
    });

    it('should work with async service', async () => {
      const initialState = await app.inject('/dependency-injection/inject/async');

      strictEqual(initialState.statusCode, 200);
      strictEqual(initialState.body, 'Message');
    });
  });

  describe('Controller with getInstanceByToken call', () => {
    it('should work with sync service', async () => {
      const initialState = await app.inject('/dependency-injection/get-instance-by-token/sync');

      strictEqual(initialState.statusCode, 200);
      strictEqual(initialState.body, 'Message');
    });

    it('should work with service injected by token', async () => {
      const initialState = await app.inject('/dependency-injection/get-instance-by-token/sync/v2');

      strictEqual(initialState.statusCode, 200);
      strictEqual(initialState.body, 'Message');
    });

    it('should work with async service', async () => {
      const initialState = await app.inject('/dependency-injection/get-instance-by-token/async');

      strictEqual(initialState.statusCode, 200);
      strictEqual(initialState.body, 'Message');
    });
  });
});
