import { FastifyInstance } from 'fastify';
import { configureControllerTest } from '@fastify-decorators/simple-di/testing';
import ConstructorController from '../../src/dependency-injection/constructor.controller.js';
import { InjectableAsyncService } from '../../src/dependency-injection/injectable-async-service.js';
import { InjectableService, injectableServiceToken } from '../../src/dependency-injection/injectable.service.js';
import GetInstanceByTokenController from '../../src/dependency-injection/get-instance-by-token.controller.js';
import InjectController from '../../src/dependency-injection/inject.controller.js';

describe('Controllers dependency injection tests', () => {
  describe('Controller with constructor', () => {
    let app: FastifyInstance;
    beforeEach(async () => {
      app = await configureControllerTest({
        controller: ConstructorController,
        mocks: [
          {
            provide: InjectableService,
            useValue: {
              getMessage() {
                return 'Message';
              },
            },
          },
        ],
      });
    });

    it('should work with sync service', async () => {
      const initialState = await app.inject('/dependency-injection/using-constructor/sync');

      expect(initialState.statusCode).toEqual(200);
      expect(initialState.body).toEqual('Message');
    });

    it('should work with async service', async () => {
      const initialState = await app.inject('/dependency-injection/using-constructor/async');

      expect(initialState.statusCode).toEqual(200);
      expect(initialState.body).toEqual('Message');
    });
  });

  describe('Controller with @Inject decorator', () => {
    let app: FastifyInstance;
    beforeEach(async () => {
      app = await configureControllerTest({
        controller: InjectController,
        mocks: [
          {
            provide: InjectableAsyncService,
            useValue: {
              getMessage() {
                return 'Message';
              },
            },
          },
          {
            provide: InjectableService,
            useValue: {
              getMessage() {
                return 'Message';
              },
            },
          },
          {
            provide: injectableServiceToken,
            useValue: {
              getMessage() {
                return 'Message';
              },
            },
          },
        ],
      });
    });

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
    let app: FastifyInstance;
    beforeEach(async () => {
      app = await configureControllerTest({
        controller: GetInstanceByTokenController,
        mocks: [
          {
            provide: InjectableAsyncService,
            useValue: {
              getMessage() {
                return 'Message';
              },
            },
          },
          {
            provide: InjectableService,
            useValue: {
              getMessage() {
                return 'Message';
              },
            },
          },
          {
            provide: injectableServiceToken,
            useValue: {
              getMessage() {
                return 'Message';
              },
            },
          },
        ],
      });
    });

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
