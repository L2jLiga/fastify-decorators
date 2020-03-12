import { CREATOR } from '../symbols';
import { Hook } from './hook';

describe('Decorators: @Hook', () => {
    it('should add method annotated with @Hook to controller options', () => {
        class Controller {
            static [CREATOR] = {
                hooks: []
            };

            @Hook('onSend')
            onSendHook() {
            }
        }

        expect(Controller[CREATOR].hooks.length).toBe(1);
        expect(Controller[CREATOR].hooks[0]).toEqual({
            name: 'onSend',
            handlerName: 'onSendHook'
        });
    });
});
