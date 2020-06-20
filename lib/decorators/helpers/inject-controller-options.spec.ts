import { CREATOR } from '../../symbols';
import { injectDefaultControllerOptions } from './inject-controller-options';

describe('Helper: inject controller options', () => {
    it('should inject default options into object if they are not exists', () => {
        class Controller {
        }

        injectDefaultControllerOptions(Controller);

        expect((<any>Controller)[CREATOR]).toEqual({
            handlers: [],
            errorHandlers: [],
            hooks: [],
        });
    });

    it('should not inject anything if object has options', () => {
        const controllerOptions = {
            hooks: []
        };

        class Controller {
            static [CREATOR] = controllerOptions;
        }

        injectDefaultControllerOptions(Controller);

        expect(Controller[CREATOR]).toBe(controllerOptions);
    });
});
