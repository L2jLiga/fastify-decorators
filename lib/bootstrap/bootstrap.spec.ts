import { fastify, FastifyInstance } from 'fastify';
import { resolve, sep } from 'path';
import { pathToFileURL, URL } from 'url';
import { servicesWithDestructors } from '../decorators/destructor.js';
import { injectables } from '../registry/injectables.js';
import { wrapInjectable } from '../utils/wrap-injectable.js';
import { bootstrap } from './bootstrap.js';
import SampleControllerMock from './mocks/controllers/sample.controller.mock.js';

describe('Bootstrap test', () => {
  afterEach(() => {
    servicesWithDestructors.clear();
    injectables.clear();
  });

  it('should autoload controller when path given', async () => {
    const instance = fastify();
    instance.register(bootstrap, {
      directory: resolve(__dirname, 'mocks'),
      mask: /\.controller\.mock\.ts/,
    });

    const res = await instance.inject({ url: '/index' });

    expect(res.payload).toBe('{"message":"ok"}');
  });

  it('should autoload controller when URL given', async () => {
    const instance = fastify();
    instance.register(bootstrap, {
      directory: new URL('mocks', pathToFileURL(__dirname + sep)),
      mask: /\.controller\.mock\.ts/,
    });

    const res = await instance.inject({ url: '/index' });

    expect(res.payload).toBe('{"message":"ok"}');
  });

  it('should autoload controller when URL to file given', async () => {
    const instance = fastify();

    const importMetaUrlLike = pathToFileURL(__filename);

    instance.register(bootstrap, {
      directory: importMetaUrlLike,
      mask: /\.controller\.mock\.ts/,
    });

    const res = await instance.inject({ url: '/index' });

    expect(res.payload).toBe('{"message":"ok"}');
  });

  it('should autoload controller when import.meta.url given', async () => {
    const instance = fastify();

    const importMetaUrlLike = pathToFileURL(__filename).toString();

    instance.register(bootstrap, {
      directory: importMetaUrlLike,
      mask: /\.controller\.mock\.ts/,
    });

    const res = await instance.inject({ url: '/index' });

    expect(res.payload).toBe('{"message":"ok"}');
  });

  it('should bootstrap request handler', async () => {
    const instance = fastify();
    instance.register(bootstrap, {
      directory: resolve(__dirname, 'mocks'),
      mask: /\.handler\.mock\.ts/,
    });

    const res = await instance.inject({ url: '/index' });

    expect(res.payload).toBe('{"message":"ok"}');
  });

  it('should not bootstrap server when try to bootstrap controllers/handlers with same routes', async () => {
    const instance = fastify();
    instance.register(bootstrap, {
      directory: resolve(__dirname, 'mocks'),
      mask: /\.mock\.ts/,
    });

    await expect(instance.inject({ url: '/index' })).rejects.toThrow();
  });

  it('should load specified controllers', async () => {
    const instance = fastify();
    instance.register(bootstrap, {
      controllers: [SampleControllerMock],
    });

    const res = await instance.inject({ url: '/index' });

    expect(res.payload).toBe('{"message":"ok"}');
  });

  it('should apply global prefix for routes', async () => {
    const instance = fastify();
    instance.register(bootstrap, {
      controllers: [SampleControllerMock],
      prefix: '/api/v1',
    });

    const res = await instance.inject({ url: '/api/v1/index' });

    expect(res.payload).toBe('{"message":"ok"}');
  });

  it('should throw an error while bootstrap application', async () => {
    const instance = fastify();
    instance.register(bootstrap, {
      directory: resolve(__dirname, 'mocks', 'controllers'),
      mask: /\.ts/,
    });

    await expect(instance.inject({ url: '/broken' })).rejects.toThrow();
  });

  it('should skip broken controller', async () => {
    const instance = fastify();
    instance.register(bootstrap, {
      directory: resolve(__dirname, 'mocks', 'controllers'),
      mask: /\.ts/,
      skipBroken: true,
    });

    const res1 = await instance.inject({ url: '/index' });
    const res2 = await instance.inject({ url: '/broken' });

    expect(res1.payload).toBe('{"message":"ok"}');
    expect(res2.statusCode).toBe(404);
  });

  it('should define graceful shutdown', async () => {
    class Foo {
      bar = jest.fn();
    }

    const foo = new Foo();
    injectables.set(Foo, wrapInjectable(foo));
    servicesWithDestructors.set(Foo, 'bar');
    const instance = {
      addHook(hook: 'onClose', handler: () => Promise<void>) {
        expect(hook).toBe('onClose');
        expect(handler).toBeInstanceOf(Function);
        handler();
      },
    } as FastifyInstance;
    instance.decorate = () => instance;

    await bootstrap(instance, { controllers: [] });

    expect(foo.bar).toHaveBeenCalled();
  });

  it('should support custom class loader', async () => {
    const classLoader = jest.fn().mockImplementation((c) => new c());

    await bootstrap(fastify(), { controllers: [SampleControllerMock], classLoader: classLoader });

    expect(classLoader).toHaveBeenCalledWith(SampleControllerMock);
  });
});
