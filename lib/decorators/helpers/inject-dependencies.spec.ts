// eslint-disable-next-line @typescript-eslint/no-namespace
import { InjectableService } from '../../interfaces/injectable-class';
import { CREATOR, INJECTABLES } from '../../symbols';
import { createWithInjectedDependencies } from './inject-dependencies';

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Reflect {
    function getMetadata(metadataKey: string, target: unknown): unknown[];
}

describe('Helpers: inject dependencies', () => {
    class Service {
        static [INJECTABLES] = new Map();
        static [CREATOR] = {
            register() {
                return new Service();
            },
        };
    }

    it('should not try to inject when Reflect metadata not available', () => {
        // @ts-expect-error `forcefully` disable reflect-metadata
        Reflect.getMetadata = undefined;

        class A {
            constructor(public field: Service) {
            }
        }

        const instance = createWithInjectedDependencies(A, new Map(), false);

        expect(instance.field).toBeUndefined();
    });

    it('should throw error when service is missing in injectables map', () => {
        Reflect.getMetadata = (key, target) => {
            if (target === A) return [Service];
            else return [];
        };

        class A {
            constructor(public field: Service) {
            }
        }

        expect(() => createWithInjectedDependencies(A, new Map([]), false)).toThrow();
    });

    it('should inject service', () => {
        Reflect.getMetadata = (key, target) => {
            if (target === A) return [Service];
            else return [];
        };

        class A {
            constructor(public field: Service) {
            }
        }

        const instance = createWithInjectedDependencies(A, new Map([[Service, Service as InjectableService]]), false);

        expect(instance.field).toBeInstanceOf(Service);
    });
});
