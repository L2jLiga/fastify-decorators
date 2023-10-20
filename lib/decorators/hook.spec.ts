import type { FastifyReply, FastifyRequest } from 'fastify';
import { getHooksContainer } from './helpers/class-metadata.js';
import { Hook } from './hook.js';

describe('Decorators: @IHook', () => {
  it('should add method annotated with @IHook to controller options', () => {
    class Controller {
      @Hook('onSend')
      onSendHook(request: FastifyRequest, reply: FastifyReply, payload: unknown, done: () => void) {
        done();
      }
    }

    const hooks = getHooksContainer(Controller);

    expect(hooks).toHaveLength(1);
    expect([...hooks][0]).toEqual({
      name: 'onSend',
      handlerName: 'onSendHook',
    });
  });
});
