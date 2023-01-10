import { SERVICE_INJECTION } from '../../symbols.js';
import { Container } from '../../utils/container.js';
import { ensureServiceInjection, hasServiceInjection } from './ensure-service-injection.js';
import { ServiceInjection } from './inject-dependencies.js';

describe('Helpers: ensure service injection', () => {
  describe('ensuring class has service injection field', () => {
    it('should create container for service injection', () => {
      const TestClass = class {};

      ensureServiceInjection(TestClass);

      expect(TestClass[SERVICE_INJECTION]).toBeInstanceOf(Container);
    });

    it('should create own container when class have inherited', () => {
      class ParentClass {
        static [SERVICE_INJECTION] = new Container<ServiceInjection>();
      }

      class ChildClass extends ParentClass {}

      ensureServiceInjection(ChildClass);

      expect(ChildClass[SERVICE_INJECTION]).toBeInstanceOf(Container);
      expect(ChildClass[SERVICE_INJECTION]).not.toBe(ParentClass[SERVICE_INJECTION]);
    });
  });

  describe('checking whether class has service injection', () => {
    it('should return false when class has no service injection', () => {
      class TestClass {}

      const result = hasServiceInjection(TestClass);

      expect(result).toBeFalsy();
    });

    it('should return true when class has service injection', () => {
      class TestClass {
        static [SERVICE_INJECTION] = new Container();
      }

      const result = hasServiceInjection(TestClass);

      expect(result).toBeTruthy();
    });

    it('should return true when parent class has service injection', () => {
      class ParentClass {
        static [SERVICE_INJECTION] = new Container<ServiceInjection>();
      }
      class ChildClass extends ParentClass {}

      const result = hasServiceInjection(ChildClass);

      expect(result).toBeTruthy();
    });
  });
});
