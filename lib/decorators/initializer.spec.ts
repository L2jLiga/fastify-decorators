import { INITIALIZER } from '../symbols';
import { Initializer, readyMap } from './initializer';

describe('Decorator: @Initializer', () => {
    afterEach(() => readyMap.clear());

    it('should resolve deferred when async initializer succeeded', async () => {
        class Target {
            @Initializer()
            async init(): Promise<void> {
                return Promise.resolve();
            }
        }

        // @ts-expect-error ts does not know about symbol added by this decorator
        await Target[INITIALIZER](new Target());

        await expect(readyMap.get(Target)).resolves.toBeUndefined();
    });

    it('should resolve deferred when async initializer of service and it\'s dependencies succeeded', async () => {
        class Dep1 {
        }

        class Dep2 {
        }

        readyMap.set(Dep1, Promise.resolve()).set(Dep2, Promise.resolve());

        class Target {
            @Initializer([Dep1, Dep2])
            async init(): Promise<void> {
                return Promise.resolve();
            }
        }

        // @ts-expect-error ts does not know about symbol added by this decorator
        await Target[INITIALIZER](new Target());

        await expect(readyMap.get(Target)).resolves.toBeUndefined();
    });

    it('should reject deferred when some of dependencies initializer failed', async () => {
        class Dep1 {
        }

        class Dep2 {
        }

        readyMap.set(Dep1, Promise.resolve()).set(Dep2, Promise.reject());

        class Target {
            @Initializer([Dep1, Dep2])
            async init(): Promise<void> {
                return Promise.resolve();
            }
        }

        // @ts-expect-error ts does not know about symbol added by this decorator
        await Target[INITIALIZER](new Target());

        await expect(readyMap.get(Target)).rejects.toBeUndefined();
    });

    it('should reject deferred when async initializer failed', async () => {
        class Target {
            @Initializer()
            async init(): Promise<void> {
                return Promise.reject();
            }
        }

        // @ts-expect-error ts does not know about symbol added by this decorator
        await Target[INITIALIZER](new Target());

        await expect(readyMap.get(Target)).rejects.toBeUndefined();
    });
});
