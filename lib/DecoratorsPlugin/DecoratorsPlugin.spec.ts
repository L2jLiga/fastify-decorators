import Fastify from 'fastify';
import { resolve, sep } from 'path';
import { pathToFileURL, URL } from 'url';
import { Destructor } from '../Decorators/Destructor/Destructor';
import { Controller, Inject, Service } from '../Decorators/index.js';
import { _injectablesHolder } from '../Registry/_injectables-holder.js';
import { destructors } from '../Registry/destructors.js';
import { CLASS_LOADER } from '../Symbols/index.js';
import bootstrap from './DecoratorsPlugin.js';
import SampleControllerMock from './Mocks/Controllers/Sample.controller.mock';

describe('Bootstrap test', () => {
  const controllerMockMask = /\.controller\.mock\.ts/;

  afterEach(() => {
    destructors.clear();
    _injectablesHolder.reset();
  });

  it('should autoload controller when path given', async () => {
    const fastify = Fastify();
    fastify.register(bootstrap, {
      directory: resolve(__dirname, 'Mocks'),
      mask: controllerMockMask,
    });

    const res = await fastify.inject({ url: '/index' });
    expect(res.payload).toBe(`{"message":"ok"}`);
  });

  it('should autoload controller when URL given', async () => {
    const fastify = Fastify();
    fastify.register(bootstrap, {
      directory: new URL('Mocks', pathToFileURL(__dirname + sep)),
      mask: controllerMockMask,
    });

    const res = await fastify.inject({ url: '/index' });

    expect(res.payload).toBe(`{"message":"ok"}`);
  });

  it('should autoload controller when URL to file given', async () => {
    const fastify = Fastify();
    const importMetaUrlLike = pathToFileURL(__filename);
    fastify.register(bootstrap, {
      directory: importMetaUrlLike,
      mask: controllerMockMask,
    });

    const res = await fastify.inject({ url: '/index' });
    expect(res.payload).toBe(`{"message":"ok"}`);
  });

  it('should autoload controller when import.meta.url given', async () => {
    const fastify = Fastify();
    const importMetaUrlLike = pathToFileURL(__filename).toString();
    fastify.register(bootstrap, {
      directory: importMetaUrlLike,
      mask: controllerMockMask,
    });

    const res = await fastify.inject({ url: '/index' });
    expect(res.payload).toBe(`{"message":"ok"}`);
  });

  it('should bootstrap request handler', async () => {
    const fastify = Fastify();
    fastify.register(bootstrap, {
      directory: resolve(__dirname, 'Mocks'),
      mask: /\.handler\.mock\.ts/,
    });

    const res = await fastify.inject({ url: '/index' });
    expect(res.payload).toBe(`{"message":"ok"}`);
  });

  it('should not bootstrap server when try to bootstrap controllers/handlers with same routes', async () => {
    const fastify = Fastify();
    fastify.register(bootstrap, {
      directory: resolve(__dirname, 'Mocks'),
      mask: /\.mock\.ts/,
    });

    await expect(fastify.inject({ url: '/index' })).rejects.toThrow();
  });

  it('should load specified controllers', async () => {
    const fastify = Fastify();
    fastify.register(bootstrap, {
      controllers: [SampleControllerMock],
    });

    const res = await fastify.inject({ url: '/index' });
    expect(res.payload).toBe(`{"message":"ok"}`);
  });

  it('should apply global prefix for routes', async () => {
    const fastify = Fastify();
    fastify.register(bootstrap, {
      controllers: [SampleControllerMock],
      prefix: '/api/v1',
    });

    const res = await fastify.inject({ url: '/api/v1/index' });
    expect(res.payload).toBe(`{"message":"ok"}`);
  });

  it('should throw an error while bootstrap application', async () => {
    const fastify = Fastify();
    fastify.register(bootstrap, {
      directory: resolve(__dirname, 'Mocks', 'controllers'),
      mask: /\.ts/,
    });

    await expect(fastify.inject({ url: '/broken' })).rejects.toThrow();
  });

  it('should skip broken controller', async () => {
    const fastify = Fastify();
    fastify.register(bootstrap, {
      directory: resolve(__dirname, 'Mocks', 'Controllers'),
      mask: /\.ts/,
      skipBroken: true,
    });

    const res1 = await fastify.inject({ url: '/index' });
    const res2 = await fastify.inject({ url: '/broken' });

    expect(res1.payload).toBe(`{"message":"ok"}`);
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

    const fastify = Fastify();

    await bootstrap(fastify, { controllers: [TestController] });
    await fastify.close();

    expect(fastify[CLASS_LOADER](Used).foo).toHaveBeenCalled();
    expect(fastify[CLASS_LOADER](NotUsed).bar).not.toHaveBeenCalled();
  });

  it('should support custom class loader', async () => {
    const classLoader = jest.fn().mockImplementation((c) => new c());

    await bootstrap(Fastify(), {
      controllers: [SampleControllerMock],
      classLoader,
    });
    expect(classLoader).toHaveBeenCalledWith(SampleControllerMock);
  });
});
