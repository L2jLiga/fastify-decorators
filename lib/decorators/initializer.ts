import { INITIALIZER } from '../symbols';
import { Deferred } from '../utils/deferred';

export const readyMap = new Map<any, Promise<void>>();

/**
 * Used to mark a Service method to be called after all the Services are created, but before the server starts
 *
 * @param dependencies The dependencies that need to be initialized before this one will be
 */
export function Initializer(dependencies?: any[]): MethodDecorator {
    return (targetPrototype: any, propertyKey) => {
        const target = targetPrototype.constructor;
        const ready = new Deferred()

        target[INITIALIZER] = async (self: any) => {
            try {
                if (dependencies)
                    await Promise.all(dependencies.map(dep => readyMap.get(dep)));

                await targetPrototype[propertyKey].call(self);
                ready.resolve();
            } catch (e) {
                ready.reject(e);
            }
        };

        readyMap.set(target, ready.promise);
    };
}
