import { CREATOR } from 'fastify-decorators/plugins';
import { InjectableService } from '../../interfaces/injectable-class.js';
import { _InjectablesHolder } from '../../registry/_injectables-holder.js';
import { defaultScope } from '../../utils/dependencies-scope-manager.js';
import { Inject } from '../inject.js';
import { classLoaderFactory } from './inject-dependencies.js';

describe('Helpers: inject dependencies', () => {
  class Service {
    static [CREATOR] = {
      register() {
        return new Service();
      },
    };
  }

  it('should cache result', () => {
    const classLoader = classLoaderFactory(new _InjectablesHolder());
    class Constructable {}

    const first = classLoader(Constructable, defaultScope);
    const second = classLoader(Constructable, defaultScope);

    expect(first).toBe(second);
  });

  describe('Defined by @Inject', () => {
    it('should inject service', () => {
      class A {
        @Inject(Service)
        public field!: Service;
      }

      const injectables = new _InjectablesHolder();
      injectables.injectService(Service, Service as InjectableService);
      const instance = classLoaderFactory(injectables)(A, defaultScope);

      expect(instance.field).toBeInstanceOf(Service);
    });

    it('should throw when service was not found in Injectables', () => {
      class A {
        @Inject(Service)
        public field!: Service;
      }

      expect(() => classLoaderFactory(new _InjectablesHolder())(A, defaultScope)).toThrow(
        `Invalid argument provided for "A.field". Expected class annotated with @Service.`,
      );
    });
  });
});
