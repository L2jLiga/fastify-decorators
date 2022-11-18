import { IErrorHandler, IHandler, IHook } from '../../interfaces/index.js';
import { ERROR_HANDLERS, HANDLERS, HOOKS } from '../../symbols/index.js';
import { ensureErrorHandlers, ensureHandlers, ensureHooks, hasErrorHandlers, hasHandlers, hasHooks } from './class-properties.js';
import { Container } from './container.js';

describe('Helpers: class properties', () => {
  describe('ensure object has handlers symbol', () => {
    it('should create when not exists', () => {
      class obj {
        static [HANDLERS]?: Container<IHandler>;
      }

      ensureHandlers(obj);

      expect(obj[HANDLERS]).toBeInstanceOf(Container);
    });

    it('should not create when exists', () => {
      const handlers = new Container<IHandler>();
      class obj {
        static [HANDLERS] = handlers;
      }

      ensureHandlers(obj);

      expect(obj[HANDLERS]).toBe(handlers);
    });
  });

  describe('check if handlers symbol exists', () => {
    it('should return false when not exists', () => {
      class obj {}

      const result = hasHandlers(obj);

      expect(result).toBe(false);
    });

    it('should return true when exists', () => {
      class obj {
        static [HANDLERS] = new Container();
      }

      const result = hasHandlers(obj);

      expect(result).toBe(true);
    });
  });

  describe('ensure object has error handlers symbol', () => {
    it('should create when not exists', () => {
      class obj {
        static [ERROR_HANDLERS]?: Container<IErrorHandler>;
      }

      ensureErrorHandlers(obj);

      expect(obj[ERROR_HANDLERS]).toBeInstanceOf(Container);
    });

    it('should not create when exists', () => {
      const errorHandlers = new Container<IErrorHandler>();
      class obj {
        static [ERROR_HANDLERS] = errorHandlers;
      }

      ensureErrorHandlers(obj);

      expect(obj[ERROR_HANDLERS]).toBe(errorHandlers);
    });
  });

  describe('check if error handlers symbol exists', () => {
    it('should return false when not exists', () => {
      class obj {}

      const result = hasErrorHandlers(obj);

      expect(result).toBe(false);
    });

    it('should return true when exists', () => {
      class obj {
        static [ERROR_HANDLERS] = new Container<IErrorHandler>();
      }

      const result = hasErrorHandlers(obj);

      expect(result).toBe(true);
    });
  });

  describe('ensure object has hooks symbol', () => {
    it('should create when not exists', () => {
      class obj {
        static [HOOKS]?: Container<IHook>;
      }

      ensureHooks(obj);

      expect(obj[HOOKS]).toBeInstanceOf(Container);
    });

    it('should not create when exists', () => {
      const hooks = new Container<IHook>();
      class obj {
        static [HOOKS] = hooks;
      }

      ensureHooks(obj);

      expect(obj[HOOKS]).toBe(hooks);
    });
  });

  describe('check if hooks symbol exists', () => {
    it('should return false when not exists', () => {
      class obj {}

      const result = hasHooks(obj);

      expect(result).toBe(false);
    });

    it('should return true when exists', () => {
      class obj {
        static [HOOKS] = new Container<IHook>();
      }

      const result = hasHooks(obj);

      expect(result).toBe(true);
    });
  });
});
