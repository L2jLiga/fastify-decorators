import type { FastifyReply, FastifyRequest } from 'fastify';
import { IHook } from '../interfaces/index.js';
import { HOOKS } from '../symbols/index.js';
import { Container } from './helpers/container.js';
import { Hook } from './hook.js';

describe('Decorators: @IHook', () => {
  it('should add method annotated with @IHook to controller options', () => {
    class Controller {
      @Hook('onSend')
      onSendHook(request: FastifyRequest, reply: FastifyReply, payload: unknown, done: () => void) {
        done();
      }
    }

    // @ts-expect-error HOOKS created implicitly
    const hooks = Controller[HOOKS] as Container<IHook>;

    expect(hooks).toHaveLength(1);
    expect([...hooks][0]).toEqual({
      name: 'onSend',
      handlerName: 'onSendHook',
    });
  });
});
