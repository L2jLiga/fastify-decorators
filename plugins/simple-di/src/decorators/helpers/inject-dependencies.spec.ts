import 'reflect-metadata';
import { injectables } from '../../registry/injectables.js';
import { wrapInjectable } from '../../utils/wrap-injectable.js';
import { Inject } from '../inject.js';
import { Service } from '../service.js';
import { injectDependenciesIntoInstance, patchConstructable, createWithConstructorDependencies } from './inject-dependencies.js';

describe('Helpers: inject dependencies', () => {
  afterEach(() => injectables.clear());

  describe('Injecting dependencies into created instance', () => {
    it('should inject field dependencies', () => {
      @Service()
      class TestService {
        @Inject(ToBeInjected) declare injected: ToBeInjected;
      }

      const instance = new TestService();

      injectDependenciesIntoInstance(instance, TestService, new Map([[ToBeInjected, wrapInjectable(new ToBeInjected())]]), false);

      expect(instance.injected).toBeInstanceOf(ToBeInjected);
    });

    it('should inject constructor dependencies', () => {
      @Service()
      class TestService {
        constructor(public injected: ToBeInjected) {}
      }

      const instance = new TestService(null as unknown as ToBeInjected);

      injectDependenciesIntoInstance(instance, TestService, new Map([[ToBeInjected, wrapInjectable(new ToBeInjected())]]), false);

      expect(instance.injected).toBeInstanceOf(ToBeInjected);
    });

    it('should inject inherited fields dependencies', () => {
      class ParentService {
        @Inject(ToBeInjected) declare injected: ToBeInjected;
      }

      @Service()
      class TestService extends ParentService {}

      const instance = new TestService();

      injectDependenciesIntoInstance(instance, TestService, new Map([[ToBeInjected, wrapInjectable(new ToBeInjected())]]), false);

      expect(instance.injected).toBeInstanceOf(ToBeInjected);
    });

    it('should inject inherited constructor dependencies', () => {
      @Service()
      class ParentService {
        constructor(public injected: ToBeInjected) {}
      }

      @Service()
      class TestService extends ParentService {}

      const instance = new TestService(null as unknown as ToBeInjected);

      injectDependenciesIntoInstance(instance, TestService, new Map([[ToBeInjected, wrapInjectable(new ToBeInjected())]]), false);

      expect(instance.injected).toBeInstanceOf(ToBeInjected);
    });
  });

  describe('Patching constructable with dependencies', () => {
    it('should inject field dependencies', () => {
      @Service()
      class TestService {
        @Inject(ToBeInjected) declare injected: ToBeInjected;
      }

      patchConstructable(TestService, new Map([[ToBeInjected, wrapInjectable(new ToBeInjected())]]), false);

      expect(new TestService().injected).toBeInstanceOf(ToBeInjected);
    });

    it('should inject static field dependencies', () => {
      @Service()
      class TestService {
        @Inject(ToBeInjected) static injected: ToBeInjected;
      }

      patchConstructable(TestService, new Map([[ToBeInjected, wrapInjectable(new ToBeInjected())]]), false);

      expect(TestService.injected).toBeInstanceOf(ToBeInjected);
    });

    it('should inject inherited field dependencies', () => {
      @Service()
      class ParentService {
        @Inject(ToBeInjected) declare injected: ToBeInjected;
      }

      @Service()
      class TestService extends ParentService {}

      patchConstructable(TestService, new Map([[ToBeInjected, wrapInjectable(new ToBeInjected())]]), false);

      expect(new TestService().injected).toBeInstanceOf(ToBeInjected);
    });

    it('should inject inherited static field dependencies', () => {
      @Service()
      class ParentService {
        @Inject(ToBeInjected) static injected: ToBeInjected;
      }

      @Service()
      class TestService extends ParentService {}

      patchConstructable(TestService, new Map([[ToBeInjected, wrapInjectable(new ToBeInjected())]]), false);

      expect(TestService.injected).toBeInstanceOf(ToBeInjected);
    });
  });

  describe('Constructing class instance with dependencies', () => {
    it('should inject constructor dependencies', () => {
      @Service()
      class TestService {
        constructor(public injected: ToBeInjected) {}
      }

      const instance = createWithConstructorDependencies(TestService, new Map([[ToBeInjected, wrapInjectable(new ToBeInjected())]]), false);

      expect(instance.injected).toBeInstanceOf(ToBeInjected);
    });

    it('should inject inherited constructor dependencies', () => {
      @Service()
      class ParentService {
        constructor(public injected: ToBeInjected) {}
      }

      @Service()
      class TestService extends ParentService {}

      const instance = createWithConstructorDependencies(TestService, new Map([[ToBeInjected, wrapInjectable(new ToBeInjected())]]), false);

      expect(instance.injected).toBeInstanceOf(ToBeInjected);
    });
  });
});

class ToBeInjected {}
