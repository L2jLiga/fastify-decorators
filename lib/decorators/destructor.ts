import { DESTRUCTOR } from '../symbols/index.js';

export function Destructor(): PropertyDecorator {
  return (targetPrototype: any, propertyKey: string | symbol): void => {
    const target = targetPrototype.constructor;

    target[DESTRUCTOR] = propertyKey;
  };
}
