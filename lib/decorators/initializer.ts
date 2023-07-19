import { INITIALIZER } from '../symbols/index.js';
import { Deferred } from '../utils/deferred.js';

export const readyMap = new Map<unknown, Promise<unknown>>();
export const initializersMap = new Map<unknown, Promise<unknown>>();

/**
 * Used to mark a Service method to be called after all the Services are created, but before the server starts
 *
 * @param dependencies The dependencies that need to be initialized before this one will be
 */
export function Initializer(dependencies: unknown[] = []): PropertyDecorator {
  return (targetPrototype: any, propertyKey: string | symbol) => {
    const target = targetPrototype.constructor;
    const ready = new Deferred();

    target[INITIALIZER] = (self: Record<typeof propertyKey, () => void>) => {
      return Promise.all(dependencies.map((dep) => initializersMap.get(dep)))
        .then(() => self[propertyKey as string]())
        .then(ready.resolve)
        .catch(ready.reject);
    };

    initializersMap.set(target, ready.promise);
  };
}
