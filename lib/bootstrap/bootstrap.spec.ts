import { fastify } from 'fastify';
import { resolve, sep } from 'path';
import { pathToFileURL, URL } from 'url';
import { Destructor } from '../decorators/destructor.js';
import { Controller, Inject, Service } from '../decorators/index.js';
import { destructors } from '../registry/destructors.js';
import { injectables } from '../registry/injectables.js';
import { CLASS_LOADER } from '../symbols/index.js';
import { bootstrap } from './bootstrap.js';
import SampleControllerMock from './mocks/controllers/sample.controller.mock.js';

describe('Bootstrap test', () => {
  afterEach(() => {
    destructors.clear();
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
    @Service()
    class NotUsed {
      @Destructor()
      bar = jest.fn();
    }

    @Service()
    class Used {
      @Destructor()
      foo = jest.fn();
    }

    @Controller('')
    class TestController {
      @Inject(Used) declare used: Used;
    }

    const instance = fastify();

    await bootstrap(instance, { controllers: [TestController] });
    await instance.close();

    expect(instance[CLASS_LOADER](Used).foo).toHaveBeenCalled();
    expect(instance[CLASS_LOADER](NotUsed).bar).not.toHaveBeenCalled();
  });

  it('should support custom class loader', async () => {
    const classLoader = jest.fn().mockImplementation((c) => new c());

    await bootstrap(fastify(), { controllers: [SampleControllerMock], classLoader: classLoader });

    expect(classLoader).toHaveBeenCalledWith(SampleControllerMock);
  });
});
