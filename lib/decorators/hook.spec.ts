import type { FastifyReply } from 'fastify';
import type { FastifyRequest } from 'fastify';
import { HOOKS } from '../symbols/index.js';
import { Hook } from './hook.js';

describe('Decorators: @Hook', () => {
  it('should add method annotated with @Hook to controller options', () => {
    class Controller {
      @Hook('onSend')
      onSendHook(request: FastifyRequest, reply: FastifyReply, payload: unknown, done: () => void) {
        done();
      }
    }

    // @ts-expect-error HOOKS created implicitly
    expect(Controller[HOOKS][0]).toEqual({
      name: 'onSend',
      handlerName: 'onSendHook',
    });
  });
});
