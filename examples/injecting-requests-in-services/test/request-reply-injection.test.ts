import { FastifyInstance } from 'fastify';
import { configureControllerTest } from '@fastify-decorators/simple-di/testing';
import { TestController } from '../src/controllers/TestController.js';

describe('Controllers dependency injection tests', () => {
  let app: FastifyInstance;
  beforeEach(async () => {
    app = await configureControllerTest({
      controller: TestController,
    });
  });

  it('should be able to inject request/reply in first level service', async () => {
    const initialState = await app.inject('/test/nested-1');

    expect(initialState.statusCode).toEqual(200);
    expect(initialState.body).toEqual('GET');
  });

  it('should be able to inject request/reply in second level service', async () => {
    const initialState = await app.inject('/test/nested-2');

    expect(initialState.statusCode).toEqual(200);
    expect(initialState.body).toEqual('GET');
  });

  it('should be able to inject request/reply in third level service', async () => {
    const initialState = await app.inject('/test/nested-3');

    expect(initialState.statusCode).toEqual(200);
    expect(initialState.body).toEqual('GET');
  });
});
