import { FastifyReply } from 'fastify/types/reply';
import { FastifyRequest } from 'fastify/types/request';
import { HOOKS } from '../symbols';
import { Hook } from './hook';

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
