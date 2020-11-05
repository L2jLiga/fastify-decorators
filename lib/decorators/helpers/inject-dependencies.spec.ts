// eslint-disable-next-line @typescript-eslint/no-namespace
import { InjectableService } from '../../interfaces/injectable-class';
import { CREATOR, INJECTABLES } from '../../symbols';
import { createWithInjectedDependencies } from './inject-dependencies';
import { Inject } from '../inject';

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

    describe('Defined in constructor', () => {
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

            expect(() => createWithInjectedDependencies(A, new Map([]), false))
                .toThrow(`Invalid argument provided in A's constructor. Expected class annotated with @Service.`);
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

    describe('Defined by @Inject', () => {
        it('should inject service', () => {
            class A {
                @Inject(Service)
                public field!: Service;
            }

            const instance = createWithInjectedDependencies(A, new Map([[Service, Service as InjectableService]]), false);

            expect(instance.field).toBeInstanceOf(Service);
        });

        it('should throw when service was not found in Injectables', () => {
            class A {
                @Inject(Service)
                public field!: Service;
            }

            expect(() => createWithInjectedDependencies(A, new Map(), false))
                .toThrow(`Invalid argument provided for "A.field". Expected class annotated with @Service.`);
        });
    });
});
