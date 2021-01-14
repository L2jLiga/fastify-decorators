import { RouteShorthandOptions } from 'fastify';
import { IErrorHandler, IHandler, IHook } from '../../interfaces/controller.js';
import { ControllerType } from '../../registry/controller-type.js';
import { ERROR_HANDLERS, HANDLERS, HOOKS } from '../../symbols/index.js';
import { ErrorHandler } from '../error-handler.js';
import { Hook } from '../hook.js';
import { ControllerTypeStrategies } from './controller-type.js';

describe('Strategies: controller types', () => {
  describe('Singleton strategy', () => {
    it('should do nothing with empty controller', () => {
      class Controller {}

      class Instance {}

      expect(() =>
        // @ts-expect-error classes implements only required methods -> ts show errors
        ControllerTypeStrategies[ControllerType.SINGLETON](new Instance(), Controller, new Map(), false),
      ).not.toThrow();
    });

    it('should create controller with handler', () => {
      class Controller {
        static [HANDLERS]: IHandler[] = [
          {
            url: '/',
            method: 'get',
            options: {},
            handlerMethod: 'test',
          },
        ];

        payload = 'Message';

        test() {
          return this.payload;
        }
      }

      class Instance {
        get(url: string, options: RouteShorthandOptions, handler: () => string) {
          expect(url).toBe('/');
          expect(options).toEqual({});
          expect(handler()).toBe('Message');
        }
      }

      // @ts-expect-error classes implements only required methods -> ts show errors
      ControllerTypeStrategies[ControllerType.SINGLETON](new Instance(), Controller, new Map(), false);
    });

    it('should create controller with error handlers', () => {
      class Controller {
        static [ERROR_HANDLERS]: IErrorHandler[] = [
          {
            accepts<T extends Error>(): boolean {
              return true;
            },
            handlerName: 'test',
          },
        ];

        payload = 'Message';

        test() {
          return this.payload;
        }
      }

      const instance = {
        setErrorHandler: jest.fn(),
      };

      // @ts-expect-error classes implements only required methods -> ts show errors
      ControllerTypeStrategies[ControllerType.SINGLETON](instance, Controller, new Map(), false);

      expect(instance.setErrorHandler).toHaveBeenCalled();
    });

    it('should create controller with hooks', () => {
      class Controller {
        static [HOOKS]: IHook[] = [
          {
            name: 'onRequest',
            handlerName: 'test',
          },
        ];

        payload = 'Message';

        test() {
          return this.payload;
        }
      }

      const instance = {
        addHook: jest.fn(),
      };

      // @ts-expect-error classes implements only required methods -> ts show errors
      ControllerTypeStrategies[ControllerType.SINGLETON](instance, Controller, new Map(), false);

      expect(instance.addHook).toHaveBeenCalled();
    });
  });

  describe('Per request strategy', () => {
    it('should do nothing with empty controller', () => {
      class Controller {}

      class Instance {}

      expect(() =>
        // @ts-expect-error classes implements only required methods -> ts show errors
        ControllerTypeStrategies[ControllerType.REQUEST](new Instance(), Controller, new Map(), false),
      ).not.toThrow();
    });

    it('should create controller with handler', () => {
      class Controller {
        static [HANDLERS]: IHandler[] = [
          {
            url: '/',
            method: 'get',
            options: {},
            handlerMethod: 'test',
          },
        ];
        payload = 'Message';

        test() {
          return this.payload;
        }
      }

      class Instance {
        get(url: string, options: RouteShorthandOptions, handler: (req: unknown) => string) {
          expect(url).toBe('/');
          expect(options).toEqual({});
          expect(handler({})).toEqual('Message');
        }
      }

      // @ts-expect-error classes implements only required methods -> ts show errors
      ControllerTypeStrategies[ControllerType.REQUEST](new Instance(), Controller, new Map(), false);
    });

    it('should create controller with error handlers', () => {
      class Controller {
        static [ERROR_HANDLERS]: IErrorHandler[] = [
          {
            accepts<T extends Error>(): boolean {
              return true;
            },
            handlerName: 'test',
          },
        ];

        payload = 'Message';

        test() {
          return this.payload;
        }
      }

      const instance = {
        setErrorHandler: jest.fn(),
      };

      // @ts-expect-error classes implements only required methods -> ts show errors
      ControllerTypeStrategies[ControllerType.REQUEST](instance, Controller, new Map(), false);

      expect(instance.setErrorHandler).toHaveBeenCalled();
    });

    describe('Error handling', () => {
      const typeError = jest.fn();
      const generalError = jest.fn();
      class Controller {
        @ErrorHandler(TypeError)
        typeError = typeError;

        @ErrorHandler()
        general = generalError;
      }

      let errorHandler: (error: Error, request: unknown) => void;
      const instance = {
        setErrorHandler: (_errorHandler: typeof errorHandler) => (errorHandler = _errorHandler),
      };

      beforeEach(() => {
        jest.resetAllMocks();

        // @ts-expect-error classes implements only required methods -> ts show errors
        ControllerTypeStrategies[ControllerType.REQUEST](instance, Controller, new Map(), false);
      });

      it('should register error handler', () => {
        expect(errorHandler).toBeInstanceOf(Function);
      });

      it('should call TypeError handler only', async () => {
        errorHandler(new TypeError('test'), {});

        expect(typeError).toHaveBeenCalledWith(new TypeError('test'), {}, undefined);
        expect(generalError).not.toHaveBeenCalled();
      });

      it('should call general error handler when TypeError specific fails', async () => {
        typeError.mockImplementation(() => {
          throw new Error('Unaccepted');
        });
        errorHandler(new TypeError('test'), {});

        expect(typeError).toHaveBeenCalledWith(new TypeError('test'), {}, undefined);
        expect(generalError).toHaveBeenCalledWith(new Error('Unaccepted'), {}, undefined);
      });

      it('should call general error handler when non TypeError received', async () => {
        errorHandler(new Error('test'), {});

        expect(typeError).not.toHaveBeenCalled();
        expect(generalError).toHaveBeenCalledWith(new Error('test'), {}, undefined);
      });
    });

    describe('Hooks', () => {
      const onRequestHook = jest.fn();
      class Controller {
        payload = 'Message';

        @Hook('onRequest')
        onRequestHook = onRequestHook;
      }

      const hooks: Record<string, jest.Mock> = {};
      const instance = {
        addHook(type: string, handler: jest.Mock) {
          hooks[type] = handler;
        },
      };

      // @ts-expect-error classes implements only required methods -> ts show errors
      ControllerTypeStrategies[ControllerType.REQUEST](instance, Controller, new Map(), false);

      beforeEach(() => jest.resetAllMocks());

      it('should create controller with hooks', () => {
        expect(Object.keys(hooks)).toHaveLength(1);
      });

      it('should call registered right hook', () => {
        hooks.onRequest({});

        expect(onRequestHook).toHaveBeenCalled();
      });
    });
  });
});
