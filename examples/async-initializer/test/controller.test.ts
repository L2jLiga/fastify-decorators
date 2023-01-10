import { configureControllerTest } from '@fastify-decorators/simple-di/testing';
import IndexController from '../src/controllers/index.controller.js';

describe('Controller test', () => {
  it('should store all messages in holder', async () => {
    const instance = await configureControllerTest<IndexController>({ controller: IndexController });

    const response = await instance.inject('/');

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: 'ok' });

    expect(instance.controller.messages.retrieve()).toEqual(['ServiceA::init()', 'Hello from service ServiceA', 'Hello from service ServiceB']);
  });
});
