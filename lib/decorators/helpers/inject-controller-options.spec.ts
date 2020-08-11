import { CREATOR } from '../../symbols';
import { injectControllerOptions } from './inject-controller-options';

describe('Helper: inject controller options', () => {
    it('should inject default options into object if they are not exists', () => {
        class Controller {
        }

        injectControllerOptions(Controller);

        expect((<any>Controller)[CREATOR]).toEqual({});
    });

    it('should not inject anything if object has options', () => {
        const controllerOptions = {};

        class Controller {
            static [CREATOR] = controllerOptions;
        }

        injectControllerOptions(Controller);

        expect(Controller[CREATOR]).toBe(controllerOptions);
    });

    it('should throw when trying to apply it to non function-like objects', () => {
        const Controller = {};

        expect(() => injectControllerOptions(Controller)).toThrow();
    });
});
