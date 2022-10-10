import { IErrorHandler, IHandler, IHook } from '../../interfaces/controller.js';
import { ERROR_HANDLERS, HANDLERS, HOOKS } from '../../symbols/index.js';
import { ensureErrorHandlers, ensureHandlers, ensureHooks, hasErrorHandlers, hasHandlers, hasHooks } from './class-properties.js';
import { Container } from './container.js';

describe('Helpers: class properties', () => {
  describe('ensure object has handlers symbol', () => {
    it('should create when not exists', () => {
      const obj = {};

      ensureHandlers(obj);

      expect(obj[HANDLERS]).toBeInstanceOf(Container);
    });

    it('should not create when exists', () => {
      const handlers = new Container<IHandler>();
      const obj = {
        [HANDLERS]: handlers,
      };

      ensureHandlers(obj);

      expect(obj[HANDLERS]).toBe(handlers);
    });
  });

  describe('check if handlers symbol exists', () => {
    it('should return false when not exists', () => {
      const obj = {};

      const result = hasHandlers(obj);

      expect(result).toBe(false);
    });

    it('should return true when exists', () => {
      const obj = {
        [HANDLERS]: new Container(),
      };

      const result = hasHandlers(obj);

      expect(result).toBe(true);
    });
  });

  describe('ensure object has error handlers symbol', () => {
    it('should create when not exists', () => {
      const obj = {};

      ensureErrorHandlers(obj);

      expect(obj[ERROR_HANDLERS]).toBeInstanceOf(Container);
    });

    it('should not create when exists', () => {
      const errorHandlers = new Container<IErrorHandler>();
      const obj = {
        [ERROR_HANDLERS]: errorHandlers,
      };

      ensureErrorHandlers(obj);

      expect(obj[ERROR_HANDLERS]).toBe(errorHandlers);
    });
  });

  describe('check if error handlers symbol exists', () => {
    it('should return false when not exists', () => {
      const obj = {};

      const result = hasErrorHandlers(obj);

      expect(result).toBe(false);
    });

    it('should return true when exists', () => {
      const obj = {
        [ERROR_HANDLERS]: new Container<IErrorHandler>(),
      };

      const result = hasErrorHandlers(obj);

      expect(result).toBe(true);
    });
  });

  describe('ensure object has hooks symbol', () => {
    it('should create when not exists', () => {
      const obj = {};

      ensureHooks(obj);

      expect(obj[HOOKS]).toBeInstanceOf(Container);
    });

    it('should not create when exists', () => {
      const hooks = new Container<IHook>();
      const obj = {
        [HOOKS]: hooks,
      };

      ensureHooks(obj);

      expect(obj[HOOKS]).toBe(hooks);
    });
  });

  describe('check if hooks symbol exists', () => {
    it('should return false when not exists', () => {
      const obj = {};

      const result = hasHooks(obj);

      expect(result).toBe(false);
    });

    it('should return true when exists', () => {
      const obj = {
        [HOOKS]: new Container<IHook>(),
      };

      const result = hasHooks(obj);

      expect(result).toBe(true);
    });
  });
});
