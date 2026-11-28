import { IErrorHandler, IHandler, IHook } from '../../../Interfaces/controller.js';
import { ERROR_HANDLERS, HANDLERS, HOOKS } from '../../../Symbols/index.js';
import { Container, ClassPropsHelper } from '../index.js';

describe('Helpers: class properties', () => {
  describe('ensure object has handlers symbol', () => {
    it('should create when not exists', () => {
      const obj = {};

      ClassPropsHelper.ensureHandlers(obj);

      //@ts-ignore TODO: needs description
      expect(obj[HANDLERS]).toBeInstanceOf(Container);
    });

    it('should not create when exists', () => {
      const handlers = new Container<IHandler>();
      const obj = {
        [HANDLERS]: handlers,
      };

      ClassPropsHelper.ensureHandlers(obj);

      expect(obj[HANDLERS]).toBe(handlers);
    });
  });

  describe('check if handlers symbol exists', () => {
    it('should return false when not exists', () => {
      const obj = {};

      const result = ClassPropsHelper.hasHandlers(obj);

      expect(result).toBe(false);
    });

    it('should return true when exists', () => {
      const obj = {
        [HANDLERS]: new Container(),
      };

      const result = ClassPropsHelper.hasHandlers(obj);

      expect(result).toBe(true);
    });
  });

  describe('ensure object has error handlers symbol', () => {
    it('should create when not exists', () => {
      const obj = {};

      ClassPropsHelper.ensureErrorHandlers(obj);

      //@ts-ignore TODO: needs description
      expect(obj[ERROR_HANDLERS]).toBeInstanceOf(Container);
    });

    it('should not create when exists', () => {
      const errorHandlers = new Container<IErrorHandler>();
      const obj = {
        [ERROR_HANDLERS]: errorHandlers,
      };

      ClassPropsHelper.ensureErrorHandlers(obj);

      expect(obj[ERROR_HANDLERS]).toBe(errorHandlers);
    });
  });

  describe('check if error handlers symbol exists', () => {
    it('should return false when not exists', () => {
      const obj = {};

      const result = ClassPropsHelper.hasErrorHandlers(obj);

      expect(result).toBe(false);
    });

    it('should return true when exists', () => {
      const obj = {
        [ERROR_HANDLERS]: new Container<IErrorHandler>(),
      };

      const result = ClassPropsHelper.hasErrorHandlers(obj);

      expect(result).toBe(true);
    });
  });

  describe('ensure object has hooks symbol', () => {
    it('should create when not exists', () => {
      const obj = {};

      ClassPropsHelper.ensureHooks(obj);

      //@ts-ignore TODO: needs description
      expect(obj[HOOKS]).toBeInstanceOf(Container);
    });

    it('should not create when exists', () => {
      const hooks = new Container<IHook>();
      const obj = {
        [HOOKS]: hooks,
      };

      ClassPropsHelper.ensureHooks(obj);

      expect(obj[HOOKS]).toBe(hooks);
    });
  });

  describe('check if hooks symbol exists', () => {
    it('should return false when not exists', () => {
      const obj = {};

      const result = ClassPropsHelper.hasHooks(obj);

      expect(result).toBe(false);
    });

    it('should return true when exists', () => {
      const obj = {
        [HOOKS]: new Container<IHook>(),
      };

      const result = ClassPropsHelper.hasHooks(obj);

      expect(result).toBe(true);
    });
  });
});
