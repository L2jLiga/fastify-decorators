import { CLASS_LOADER } from 'fastify-decorators/symbols/index.js';
import { configureControllerTest } from 'fastify-decorators/testing';
import IndexController from '../src/controllers/index.controller.js';
import { MessagesHolder } from '../src/services/MessagesHolder.js';

describe('Controller test', () => {
  it('should store all messages in holder', async () => {
    const instance = await configureControllerTest({ controller: IndexController });
    const messagesHolder = instance[CLASS_LOADER](MessagesHolder);

    const response = await instance.inject('/');

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: 'ok' });

    expect(messagesHolder.retrieve()).toEqual(['ServiceA::init()', 'Hello from service ServiceA', 'Hello from service ServiceB']);
  });
});
