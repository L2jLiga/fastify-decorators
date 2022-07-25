import { InjectableService } from '../../interfaces/injectable-class.js';
import { CREATOR } from '../../symbols/index.js';
import { Inject } from '../inject.js';
import { classLoaderFactory } from './inject-dependencies.js';

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Reflect {
  function getMetadata(metadataKey: string, target: unknown): unknown[];
}

describe('Helpers: inject dependencies', () => {
  class Service {
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
        constructor(public field: Service) {}
      }

      const instance = classLoaderFactory(new Map(), false)(A);

      expect(instance.field).toBeUndefined();
    });

    it('should throw error when service is missing in injectables map', () => {
      Reflect.getMetadata = (_key, target) => {
        if (target === A) return [Service];
        else return [];
      };

      class A {
        constructor(public field: Service) {}
      }

      expect(() => classLoaderFactory(new Map([]), false)(A)).toThrow(`Invalid argument provided in A's constructor. Expected class annotated with @Service.`);
    });

    it('should inject service', () => {
      Reflect.getMetadata = (_key, target) => {
        if (target === A) return [Service];
        else return [];
      };

      class A {
        constructor(public field: Service) {}
      }

      const instance = classLoaderFactory(new Map([[Service, Service as InjectableService]]), false)(A);

      expect(instance.field).toBeInstanceOf(Service);
    });
  });

  describe('Defined by @Inject', () => {
    it('should inject service', () => {
      class A {
        @Inject(Service)
        public field!: Service;
      }

      const instance = classLoaderFactory(new Map([[Service, Service as InjectableService]]), false)(A);

      expect(instance.field).toBeInstanceOf(Service);
    });

    it('should throw when service was not found in Injectables', () => {
      class A {
        @Inject(Service)
        public field!: Service;
      }

      expect(() => classLoaderFactory(new Map(), false)(A)).toThrow(`Invalid argument provided for "A.field". Expected class annotated with @Service.`);
    });
  });
});
