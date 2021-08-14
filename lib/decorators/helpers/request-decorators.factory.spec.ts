import type { RouteShorthandOptions } from 'fastify';
import { IHook } from '../../interfaces/controller.js';
import { CREATOR, HOOKS } from '../../symbols/index.js';
import { ErrorHandler } from '../error-handler.js';
import { Hook } from '../hook.js';
import { GET } from '../request-handlers.js';
import { requestDecoratorsFactory } from './request-decorators.factory.js';

describe('Factory: request decorators', () => {
  const factory = requestDecoratorsFactory('get');

  it('should parse empty config', () => {
    class Handler {}

    const instance = { get: jest.fn() };
    const decorate = factory();

    decorate(Handler);

    // @ts-expect-error created implicitly by decorate
    Handler[CREATOR].register(instance);

    expect(instance.get).toHaveBeenCalledWith('/', <RouteShorthandOptions>{}, expect.any(Function));
  });

  it('should parse config with URL only', () => {
    class Handler {}

    const instance = { get: jest.fn() };
    const decorate = factory('/url');

    decorate(Handler);

    // @ts-expect-error created implicitly by decorate
    Handler[CREATOR].register(instance);

    expect(instance.get).toHaveBeenCalledWith('/url', <RouteShorthandOptions>{}, expect.any(Function));
  });

  it('should parse config with URL and options', () => {
    class Handler {}

    const instance = { get: jest.fn() };
    const decorate = factory('/url', <RouteShorthandOptions>{ schema: { body: { type: 'string' } } });

    decorate(Handler);

    // @ts-expect-error created implicitly by decorate
    Handler[CREATOR].register(instance);

    expect(instance.get).toHaveBeenCalledWith('/url', <RouteShorthandOptions>{ schema: { body: { type: 'string' } } }, expect.any(Function));
  });

  it('should parse route config', () => {
    class Handler {}

    const instance = { get: jest.fn() };
    const decorate = factory({
      url: '/url',
      options: <RouteShorthandOptions>{ schema: { body: { type: 'string' } } },
    });

    decorate(Handler);

    // @ts-expect-error created implicitly by decorate
    Handler[CREATOR].register(instance);

    expect(instance.get).toHaveBeenCalledWith('/url', <RouteShorthandOptions>{ schema: { body: { type: 'string' } } }, expect.any(Function));
  });

  describe('hooks support', () => {
    it('should create defined hook in options when it does not exists', () => {
      class Handler {
        static [HOOKS]: IHook[] = [
          {
            name: 'onSend',
            handlerName: 'onSendFn',
          },
        ];
      }

      const instance = { get: jest.fn(), addHook: jest.fn() };
      const decorate = factory({
        url: '/url',
        options: <RouteShorthandOptions>{ schema: { body: { type: 'string' } } },
      });

      decorate(Handler);

      // @ts-expect-error created implicitly by decorate
      Handler[CREATOR].register(instance);

      expect(instance.get).toHaveBeenCalledWith(
        '/url',
        <RouteShorthandOptions>{
          onSend: expect.any(Function),
          schema: { body: { type: 'string' } },
        },
        expect.any(Function),
      );
    });

    it('onSend option should relate to onSend hook fn defined', async () => {
      const onSendHook = jest.fn();

      class Handler {
        @Hook('onSend')
        onSendHook = onSendHook;
      }

      const instance = { get: jest.fn() };
      const decorate = factory({
        url: '/url',
        options: <RouteShorthandOptions>{ schema: { body: { type: 'string' } } },
      });

      decorate(Handler);

      // @ts-expect-error created implicitly by decorate
      Handler[CREATOR].register(instance);

      const [, { onSend }] = instance.get.mock.calls.pop();
      await onSend({});

      expect(onSendHook).toHaveBeenCalledWith({});
    });

    it('should wrap current hook and add one more if hook exists in options', () => {
      class Handler {
        static [HOOKS]: IHook[] = [
          {
            name: 'onSend',
            handlerName: 'onSendFn',
          },
        ];
      }

      const instance = { get: jest.fn(), addHook: jest.fn() };
      const decorate = factory({
        url: '/url',
        options: <RouteShorthandOptions>{
          onSend() {
            return Promise.resolve();
          },
          schema: { body: { type: 'string' } },
        },
      });

      decorate(Handler);

      // @ts-expect-error created implicitly by decorate
      Handler[CREATOR].register(instance);

      expect(instance.get).toHaveBeenCalledWith(
        '/url',
        <RouteShorthandOptions>{
          onSend: [expect.any(Function), expect.any(Function)],
          schema: { body: { type: 'string' } },
        },
        expect.any(Function),
      );
    });

    it('should add hook to hook handlers array in options', () => {
      class Handler {
        static [HOOKS]: IHook[] = [
          {
            name: 'onSend',
            handlerName: 'onSendFn',
          },
        ];
      }

      const instance = { get: jest.fn(), addHook: jest.fn() };
      const decorate = factory({
        url: '/url',
        options: <RouteShorthandOptions>{
          onSend: [() => Promise.resolve()],
          schema: { body: { type: 'string' } },
        },
      });

      decorate(Handler);

      // @ts-expect-error created implicitly by decorate
      Handler[CREATOR].register(instance);

      expect(instance.get).toHaveBeenCalledWith(
        '/url',
        <RouteShorthandOptions>{
          onSend: [expect.any(Function), expect.any(Function)],
          schema: { body: { type: 'string' } },
        },
        expect.any(Function),
      );
    });
  });

  describe('error handling support', () => {
    const typeError = jest.fn();
    const generalError = jest.fn();

    @GET()
    class Handler {
      @ErrorHandler(TypeError)
      typeError = typeError;

      @ErrorHandler()
      general = generalError;
    }

    let errorHandler: (error: Error, request: unknown) => void | Promise<void>;
    const instance = { get: jest.fn() };

    beforeEach(() => {
      jest.resetAllMocks();

      // @ts-expect-error created implicitly by decorate
      Handler[CREATOR].register(instance);

      const [, { errorHandler: _errorHandler }] = instance.get.mock.calls.pop();
      errorHandler = _errorHandler;
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
});
