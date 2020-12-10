import { configureControllerTest } from 'fastify-decorators/testing';
import { TypedController } from '../src/typed.controller.js';

it('should return message from request', async () => {
  const message = 'Hello world!';
  const instance = await configureControllerTest({ controller: TypedController });

  const reply = await instance.inject({
    url: '/typed',
    method: 'POST',
    payload: { message },
  });

  expect(await reply.json()).toEqual({ message });
});
