import { FastifyReply } from 'fastify/types/reply';
import { FastifyRequest } from 'fastify/types/request';
import { CREATOR } from '../symbols';
import { Hook } from './hook';

describe('Decorators: @Hook', () => {
    it('should add method annotated with @Hook to controller options', () => {
        class Controller {
            static [CREATOR] = {
                hooks: [],
            };

            @Hook('onSend')
            onSendHook(request: FastifyRequest, reply: FastifyReply, payload: unknown, done: () => void) {
                done();
            }
        }

        expect(Controller[CREATOR].hooks[0]).toEqual({
            name: 'onSend',
            handlerName: 'onSendHook'
        });
    });
});
