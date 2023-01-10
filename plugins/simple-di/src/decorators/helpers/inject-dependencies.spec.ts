import { FastifyInstance } from 'fastify';
import { CREATOR } from 'fastify-decorators/plugins';
import { InjectableService } from '../../interfaces/injectable-class.js';
import { _InjectablesHolder } from '../../registry/_injectables-holder.js';
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

    const scope = {} as FastifyInstance;

    const first = classLoader(Constructable, scope);
    const second = classLoader(Constructable, scope);

    expect(first).toBe(second);
  });

  describe('Defined by @Inject', () => {
    it('should inject service', () => {
      class A {
        @Inject(Service)
        public field!: Service;
      }

      const scope = {} as FastifyInstance;

      const injectables = new _InjectablesHolder();
      injectables.injectService(Service, Service as InjectableService);
      const instance = classLoaderFactory(injectables)(A, scope);

      expect(instance.field).toBeInstanceOf(Service);
    });

    it('should throw when service was not found in Injectables', () => {
      class A {
        @Inject(Service)
        public field!: Service;
      }

      const scope = {} as FastifyInstance;

      expect(() => classLoaderFactory(new _InjectablesHolder())(A, scope)).toThrow(
        `Invalid argument provided for "A.field". Expected class annotated with @Service.`,
      );
    });
  });
});
