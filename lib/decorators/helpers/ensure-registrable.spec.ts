import { CREATOR } from '../../symbols/index.js';
import { ensureRegistrable } from './ensure-registrable.js';

describe('Helper: inject controller options', () => {
  it('should inject default options into object if they are not exists', () => {
    class Controller {}

    ensureRegistrable(Controller);

    // @ts-expect-error TypeScript does not know about patches within decorator
    expect(Controller[CREATOR]).toEqual({});
  });

  it('should not inject anything if object has options', () => {
    const controllerOptions = {};

    class Controller {
      static [CREATOR] = controllerOptions;
    }

    ensureRegistrable(Controller);

    expect(Controller[CREATOR]).toBe(controllerOptions);
  });

  it('should throw when trying to apply it to non function-like objects', () => {
    const Controller = {};

    expect(() => ensureRegistrable(Controller)).toThrow();
  });
});
