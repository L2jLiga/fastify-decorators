import { InjectableService } from '../../interfaces/injectable-class.js';
import { CREATOR } from 'fastify-decorators/plugins';
import { INJECTABLES } from '../../symbols.js';
import { Inject } from '../inject.js';
import { createWithInjectedDependencies } from './inject-dependencies.js';

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
    it('should throw error when service is missing in injectables map', () => {
      Reflect.getMetadata = (key, target) => {
        if (target === A) return [Service];
        else return [];
      };

      class A {
        constructor(public field: Service) {}
      }

      expect(() => createWithInjectedDependencies(A, new Map([]), false)).toThrow(
        `Invalid argument provided in A's constructor. Expected class annotated with @Service.`,
      );
    });

    it('should inject service', () => {
      Reflect.getMetadata = (key, target) => {
        if (target === A) return [Service];
        else return [];
      };

      class A {
        constructor(public field: Service) {}
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

      expect(() => createWithInjectedDependencies(A, new Map(), false)).toThrow(
        `Invalid argument provided for "A.field". Expected class annotated with @Service.`,
      );
    });
  });
});
