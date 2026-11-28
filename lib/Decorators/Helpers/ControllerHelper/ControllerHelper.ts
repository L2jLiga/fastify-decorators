import { InjectableController } from '../../../Interfaces/injectable-class.js';
import { CREATOR } from '../../../Symbols/index.js';

export default class {
  static injectOptions(controller: unknown): asserts controller is InjectableController {
    if (controller instanceof Function) {
      if (!(CREATOR in controller)) {
        Object.defineProperty(controller, CREATOR, { value: {} });
      }
    } else throw new Error('Invalid usage of @Controller decorator');
  }
}
