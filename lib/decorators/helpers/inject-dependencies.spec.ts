import { InjectableService } from '../../interfaces/injectable-class.js';
import { _InjectablesHolder } from '../../registry/_injectables-holder.js';
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

  describe('Caching', () => {
    it('should not cache result when cacheResult is falsy', () => {
      const classLoader = classLoaderFactory(new _InjectablesHolder(), false);
      class Constructable {}

      const first = classLoader(Constructable);
      const second = classLoader(Constructable);

      expect(first).not.toBe(second);
    });

    it('should cache result when cacheResult is falsy and useCached is overridden as truthy', () => {
      const classLoader = classLoaderFactory(new _InjectablesHolder(), false);
      class Constructable {}

      const first = classLoader(Constructable, true);
      const second = classLoader(Constructable, true);

      expect(first).toBe(second);
    });

    it('should cache result when cacheResult is truthy', () => {
      const classLoader = classLoaderFactory(new _InjectablesHolder(), true);
      class Constructable {}

      const first = classLoader(Constructable);
      const second = classLoader(Constructable);

      expect(first).toBe(second);
    });

    it('should not cache result when cacheResult is truthy and useCached is overridden as falsy', () => {
      const classLoader = classLoaderFactory(new _InjectablesHolder(), true);
      class Constructable {}

      const first = classLoader(Constructable, false);
      const second = classLoader(Constructable, false);

      expect(first).not.toBe(second);
    });
  });

  describe('Defined in constructor', () => {
    it('should not try to inject when Reflect metadata not available', () => {
      // @ts-expect-error `forcefully` disable reflect-metadata
      Reflect.getMetadata = undefined;

      class A {
        constructor(public field: Service) {}
      }

      const instance = classLoaderFactory(new _InjectablesHolder(), false)(A);

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

      expect(() => classLoaderFactory(new _InjectablesHolder(), false)(A)).toThrow(
        `Invalid argument provided in A's constructor. Expected class annotated with @Service.`,
      );
    });

    it('should inject service', () => {
      Reflect.getMetadata = (_key, target) => {
        if (target === A) return [Service];
        else return [];
      };

      class A {
        constructor(public field: Service) {}
      }

      const injectables = new _InjectablesHolder();
      injectables.injectService(Service, Service as InjectableService);
      const instance = classLoaderFactory(injectables, false)(A);

      expect(instance.field).toBeInstanceOf(Service);
    });
  });

  describe('Defined by @Inject', () => {
    it('should inject service', () => {
      class A {
        @Inject(Service)
        public field!: Service;
      }

      const injectables = new _InjectablesHolder();
      injectables.injectService(Service, Service as InjectableService);
      const instance = classLoaderFactory(injectables, false)(A);

      expect(instance.field).toBeInstanceOf(Service);
    });

    it('should throw when service was not found in Injectables', () => {
      class A {
        @Inject(Service)
        public field!: Service;
      }

      expect(() => classLoaderFactory(new _InjectablesHolder(), false)(A)).toThrow(
        `Invalid argument provided for "A.field". Expected class annotated with @Service.`,
      );
    });
  });
});
