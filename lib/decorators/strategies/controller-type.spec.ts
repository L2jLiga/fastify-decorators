import { FastifyInstance, RouteShorthandOptions } from 'fastify';
import { IHandler, InjectableController } from '../../interfaces/index.js';
import { _InjectablesHolder } from '../../registry/_injectables-holder.js';
import { ControllerType } from '../../registry/controller-type.js';
import { HANDLERS } from '../../symbols/index.js';
import { ErrorHandler } from '../error-handler.js';
import { classLoaderFactory } from '../helpers/inject-dependencies.js';
import { TagObject } from '../helpers/swagger-helper.js';
import { Hook } from '../hook.js';
import { ControllerTypeStrategies } from './controller-type.js';

describe('Strategies: controller types', () => {
  [['Singleton strategy', ControllerType.SINGLETON] as const, ['Per request strategy', ControllerType.REQUEST] as const].forEach(([specName, strategy]) => {
    describe(`${specName}`, () => {
      it('should do nothing with empty controller', () => {
        class Controller {}

        class Instance {}

        expect(() =>
          ControllerTypeStrategies[strategy](
            new Instance() as FastifyInstance,
            Controller as InjectableController,
            classLoaderFactory(new _InjectablesHolder()),
            [],
          ),
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

        const instance = {
          get(url: string, options: RouteShorthandOptions, handler: (req: unknown) => string) {
            expect(url).toBe('/');
            expect(options).toEqual({});
            expect(handler({})).toEqual('Message');
          },
        } as FastifyInstance;

        ControllerTypeStrategies[strategy](instance, Controller as unknown as InjectableController, classLoaderFactory(new _InjectablesHolder()), []);
      });

      it('should inject tags into handlers and swagger configuration', () => {
        const swagger: { tags?: TagObject[] } = {};

        class Controller {
          static [HANDLERS]: IHandler[] = [
            {
              url: '/',
              method: 'get',
              options: {},
              handlerMethod: 'test',
            },
          ];

          test() {
            return;
          }
        }

        const instance = {
          get(_url: string, options: RouteShorthandOptions) {
            expect(options).toEqual({ schema: { tags: ['user'] } });
          },
          addHook(_name: 'onReady', hookFn: () => void) {
            hookFn();
          },
          oas: () => swagger,
        } as FastifyInstance & { oas(): { tags?: TagObject[] } };

        ControllerTypeStrategies[strategy](instance, Controller as unknown as InjectableController, classLoaderFactory(new _InjectablesHolder()), [
          { name: 'user', description: 'User description' },
        ]);

        expect(swagger).toEqual({ tags: [{ name: 'user', description: 'User description' }] });
      });

      it('should keep tags defined in handler over tags from controller', () => {
        const swagger: { tags?: TagObject[] } = {};

        class Controller {
          static [HANDLERS]: IHandler[] = [
            {
              url: '/',
              method: 'get',
              options: { schema: { tags: ['demo'] } } as RouteShorthandOptions,
              handlerMethod: 'test',
            },
          ];

          test() {
            return;
          }
        }

        const instance = {
          get(_url: string, options: RouteShorthandOptions) {
            expect(options).toEqual({ schema: { tags: ['demo'] } });
          },
          addHook(_name: 'onReady', hookFn: () => void) {
            hookFn();
          },
          swagger: () => swagger,
        } as FastifyInstance & { swagger(): { tags?: TagObject[] } };

        ControllerTypeStrategies[strategy](instance, Controller as unknown as InjectableController, classLoaderFactory(new _InjectablesHolder()), [
          { name: 'user', description: 'User description' },
        ]);

        expect(swagger).toEqual({ tags: [{ name: 'user', description: 'User description' }] });
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
        } as unknown as FastifyInstance;

        beforeEach(() => {
          jest.resetAllMocks();

          ControllerTypeStrategies[strategy](instance, Controller as unknown as InjectableController, classLoaderFactory(new _InjectablesHolder()), []);
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
        } as FastifyInstance;

        ControllerTypeStrategies[strategy](instance, Controller as unknown as InjectableController, classLoaderFactory(new _InjectablesHolder()), []);

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
});
