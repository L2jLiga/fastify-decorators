import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { FastifyInstance, RouteShorthandOptions } from 'fastify';
import { CLASS_LOADER, Constructable, Registrable } from '../../plugins/index.js';
import { ControllerType } from '../../registry/controller-type.js';
import { ErrorHandler } from '../error-handler.js';
import { TagObject } from '../helpers/swagger-helper.js';
import { Hook } from '../hook.js';
import { GET } from '../request-handlers.js';
import { ControllerTypeStrategies } from './controller-type.js';

describe('Strategies: controller types', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  [['Singleton', ControllerType.SINGLETON] as const, ['Per request', ControllerType.REQUEST] as const].forEach(([name, controllerType]) => {
    describe(`${name} strategy`, () => {
      it('should do nothing with empty controller', () => {
        const Controller = class {} as Registrable;
        const fastifyInstance = {
          [CLASS_LOADER]: (c: Constructable) => new c(),
        } as unknown as FastifyInstance;

        expect(() => ControllerTypeStrategies[controllerType](fastifyInstance, Controller, [])).not.toThrow();
      });

      it('should create controller with handler', async () => {
        class Controller {
          payload = 'Message';

          @GET('/', {})
          test() {
            return this.payload;
          }
        }

        const result = await new Promise<string>((resolve, reject) => {
          const instance = {
            get(url: string, options: RouteShorthandOptions, handler: (req: unknown) => string | Promise<string>) {
              expect(url).toBe('/');
              expect(options).toEqual({});

              Promise.resolve(handler({})).then(resolve).catch(reject);
            },
            [CLASS_LOADER]: (c: Constructable) => new c(),
          } as unknown as FastifyInstance;

          ControllerTypeStrategies[controllerType](instance, Controller as Registrable, []);
        });

        expect(result).toBe('Message');
      });

      it('should register onRequest hook', async () => {
        const onRequestHook = jest.fn();

        class Controller {
          @Hook('onRequest')
          onRequestHook = onRequestHook;
        }

        const hooks: Record<string, jest.Mock<(arg: unknown) => Promise<unknown>>> = {};
        const instance = {
          addHook(type: string, handler: jest.Mock<(arg: unknown) => Promise<unknown>>) {
            hooks[type] = handler;
          },
          [CLASS_LOADER]: (c: Constructable) => new c(),
        } as unknown as FastifyInstance;

        await ControllerTypeStrategies[controllerType](instance, Controller as Registrable, []);
        expect(hooks).toHaveProperty('onRequest');

        await hooks.onRequest({});
        expect(onRequestHook).toHaveBeenCalled();
      });

      it('should inject tags into handlers and swagger configuration', () => {
        const swagger: { tags?: TagObject[] } = {};

        class Controller {
          @GET('/', {})
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
          [CLASS_LOADER]: (c: Constructable) => new c(),
        } as unknown as FastifyInstance & { oas(): { tags?: TagObject[] } };

        ControllerTypeStrategies[controllerType](instance, Controller as Registrable, [{ name: 'user', description: 'User description' }]);

        expect(swagger).toEqual({ tags: [{ name: 'user', description: 'User description' }] });
      });

      it('should keep tags defined in handler over tags from controller', () => {
        const swagger: { tags?: TagObject[] } = {};

        class Controller {
          @GET('/', { schema: { tags: ['demo'] } } as RouteShorthandOptions)
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
          [CLASS_LOADER]: (c: Constructable) => new c(),
        } as unknown as FastifyInstance & { swagger(): { tags?: TagObject[] } };

        ControllerTypeStrategies[controllerType](instance, Controller as unknown as Registrable, [{ name: 'user', description: 'User description' }]);

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

        let errorHandler: (error: Error, request: unknown) => void | Promise<void>;
        const instance = {
          setErrorHandler: (_errorHandler: typeof errorHandler) => (errorHandler = _errorHandler),
          [CLASS_LOADER]: (c: Constructable) => new c(),
        } as unknown as FastifyInstance;

        beforeEach(() => ControllerTypeStrategies[controllerType](instance, Controller as Registrable, []));

        it('should register error handler', () => {
          expect(errorHandler).toBeInstanceOf(Function);
        });

        it('should call TypeError handler only', async () => {
          await errorHandler(new TypeError('test'), {});

          expect(typeError).toHaveBeenCalledWith(new TypeError('test'), {}, undefined);
          expect(generalError).not.toHaveBeenCalled();
        });

        it('should call general error handler when TypeError handler throws error', async () => {
          typeError.mockImplementation(() => Promise.reject(new Error('Unaccepted')));
          await errorHandler(new TypeError('test'), {});

          expect(typeError).toHaveBeenCalledWith(new TypeError('test'), {}, undefined);
          expect(generalError).toHaveBeenCalledWith(new Error('Unaccepted'), {}, undefined);
        });

        it('should call general error handler when error is not TypeError or derivatives', async () => {
          await errorHandler(new Error('test'), {});

          expect(typeError).not.toHaveBeenCalled();
          expect(generalError).toHaveBeenCalledWith(new Error('test'), {}, undefined);
        });
      });
    });
  });
});
