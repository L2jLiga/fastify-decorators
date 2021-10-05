import { jest } from '@jest/globals';
import { FastifyInstance, RouteShorthandOptions } from 'fastify';
import { IErrorHandler, IHandler, IHook } from '../../interfaces/controller.js';
import { Registrable } from '../../plugins/shared-interfaces.js';
import { ControllerType } from '../../registry/controller-type.js';
import { ERROR_HANDLERS, HANDLERS, HOOKS } from '../../symbols/index.js';
import { ErrorHandler } from '../error-handler.js';
import { Hook } from '../hook.js';
import { ControllerTypeStrategies } from './controller-type.js';

describe('Strategies: controller types', () => {
  [['Singleton', ControllerType.SINGLETON] as const, ['Per request', ControllerType.REQUEST] as const].forEach(([name, controllerType]) => {
    describe(`${name} strategy`, () => {
      it('should do nothing with empty controller', () => {
        class Controller {}

        class Instance {}

        expect(() =>
          // @ts-expect-error classes implements only required methods -> ts show errors
          ControllerTypeStrategies[controllerType](new Instance(), Controller),
        ).not.toThrow();
      });

      it('should create controller with handler', () => {
        return new Promise<void>((done) => {
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
            async get(url: string, options: RouteShorthandOptions, handler: (req: unknown) => string | Promise<string>) {
              expect(url).toBe('/');
              expect(options).toEqual({});

              const result = await handler({});
              expect(result).toBe('Message');
              done();
            }
          }

          // @ts-expect-error we're mocking things here, hence TS arguing us :D
          ControllerTypeStrategies[controllerType](new Instance(), Controller);
        });
      });

      it('should create controller with error handlers', async () => {
        class Controller {
          static [ERROR_HANDLERS]: IErrorHandler[] = [
            {
              accepts(): boolean {
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
        await ControllerTypeStrategies[controllerType](instance, Controller);

        expect(instance.setErrorHandler).toHaveBeenCalled();
      });

      it('should create controller with hooks', async () => {
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
        await ControllerTypeStrategies[controllerType](instance, Controller);

        expect(instance.addHook).toHaveBeenCalled();
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

        let errorHandler: (error: Error, request: unknown) => void | Promise<void>;
        const instance = {
          setErrorHandler: (_errorHandler: typeof errorHandler) => (errorHandler = _errorHandler),
        } as unknown as FastifyInstance;

        beforeEach(() => {
          jest.resetAllMocks();

          return ControllerTypeStrategies[controllerType](instance, Controller as Registrable);
        });

        it('should register error handler', () => {
          expect(errorHandler).toBeInstanceOf(Function);
        });

        it('should call TypeError handler only', async () => {
          await errorHandler(new TypeError('test'), {});

          expect(typeError).toHaveBeenCalledWith(new TypeError('test'), {}, undefined);
          expect(generalError).not.toHaveBeenCalled();
        });

        it('should call general error handler when TypeError specific fails', async () => {
          typeError.mockImplementation(() => {
            throw new Error('Unaccepted');
          });
          await errorHandler(new TypeError('test'), {});

          expect(typeError).toHaveBeenCalledWith(new TypeError('test'), {}, undefined);
          expect(generalError).toHaveBeenCalledWith(new Error('Unaccepted'), {}, undefined);
        });

        it('should call general error handler when non TypeError received', async () => {
          await errorHandler(new Error('test'), {});

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
        } as FastifyInstance;

        beforeAll(() => ControllerTypeStrategies[controllerType](instance, Controller as Registrable));

        beforeEach(() => jest.resetAllMocks());

        it('should create controller with hooks', () => {
          expect(Object.keys(hooks)).toHaveLength(1);
        });

        it('should call registered right hook', async () => {
          await hooks.onRequest({});

          expect(onRequestHook).toHaveBeenCalled();
        });
      });
    });
  });
});
