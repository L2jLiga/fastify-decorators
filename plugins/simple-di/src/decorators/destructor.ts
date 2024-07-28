import { DESTRUCTOR } from '../symbols.js';

export function Destructor(): PropertyDecorator {
  return (targetPrototype, propertyKey): void => {
    const target = targetPrototype.constructor;
    ensureDestructor(target);
    target[DESTRUCTOR] = propertyKey;
  };
}

function ensureDestructor<T>(target: T): asserts target is T & { [DESTRUCTOR]: string | symbol } {
  // noop
}
