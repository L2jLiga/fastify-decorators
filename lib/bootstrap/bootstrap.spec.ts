import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CLASS_LOADER, Constructable } from '../plugins/index.js';
import { bootstrap } from './bootstrap.js';
import SampleControllerMock from './mocks/controllers/sample.controller.mock.js';

describe('Bootstrap test', () => {
  it('should autoload controller when path given', async () => {
    const fastifyInstance = await import('fastify').then((m) => m.fastify());
    fastifyInstance.register(bootstrap, {
      directory: resolve(dirname(fileURLToPath(import.meta.url)), 'mocks'),
      mask: /\.controller\.mock\.ts/,
    });

    const response = await fastifyInstance.inject({ url: '/index' });

    expect(response.json()).toEqual({ message: 'ok' });
  });

  it('should autoload controller when URL given', async () => {
    const fastifyInstance = await import('fastify').then((m) => m.fastify());
    fastifyInstance.register(bootstrap, {
      directory: new URL('mocks', import.meta.url),
      mask: /\.controller\.mock\.ts/,
    });

    const response = await fastifyInstance.inject({ url: '/index' });

    expect(response.json()).toEqual({ message: 'ok' });
  });

  it('should autoload controller when import.meta.url given', async () => {
    const fastifyInstance = await import('fastify').then((m) => m.fastify());
    fastifyInstance.register(bootstrap, {
      directory: import.meta.url,
      mask: /\.controller\.mock\.ts/,
    });

    const response = await fastifyInstance.inject({ url: '/index' });

    expect(response.json()).toEqual({ message: 'ok' });
  });

  it('should autoload controller when file URL given', async () => {
    const fastifyInstance = await import('fastify').then((m) => m.fastify());
    fastifyInstance.register(bootstrap, {
      directory: new URL(import.meta.url),
      mask: /\.controller\.mock\.ts/,
    });

    const response = await fastifyInstance.inject({ url: '/index' });

    expect(response.json()).toEqual({ message: 'ok' });
  });

  it('should bootstrap request handler', async () => {
    const fastifyInstance = await import('fastify').then((m) => m.fastify());
    fastifyInstance.register(bootstrap, {
      directory: new URL('mocks', import.meta.url),
      mask: /\.handler\.mock\.ts/,
    });

    const response = await fastifyInstance.inject({ url: '/index' });

    expect(response.json()).toEqual({ message: 'ok' });
  });

  it('should be able to bootstrap when mask is string', async () => {
    const fastifyInstance = await import('fastify').then((m) => m.fastify());
    fastifyInstance.register(bootstrap, {
      directory: new URL('mocks', import.meta.url),
      mask: '.handler.mock.ts',
    });

    const response = await fastifyInstance.inject({ url: '/index' });

    expect(response.json()).toEqual({ message: 'ok' });
  });

  it('should not bootstrap server when try to bootstrap controllers/handlers with same routes', async () => {
    const fastifyInstance = await import('fastify').then((m) => m.fastify());
    fastifyInstance.register(bootstrap, {
      directory: new URL('mocks', import.meta.url),
      mask: /\.mock\.ts/,
    });

    await expect(fastifyInstance.inject({ url: '/index' })).rejects.toThrow();
  });

  it('should load specified controllers', async () => {
    const fastifyInstance = await import('fastify').then((m) => m.fastify());
    fastifyInstance.register(bootstrap, {
      controllers: [SampleControllerMock],
    });

    const response = await fastifyInstance.inject({ url: '/index' });

    expect(response.json()).toEqual({ message: 'ok' });
  });

  it('should apply global prefix for routes', async () => {
    const fastifyInstance = await import('fastify').then((m) => m.fastify());
    fastifyInstance.register(bootstrap, {
      controllers: [SampleControllerMock],
      prefix: '/api/v1',
    });

    const response = await fastifyInstance.inject({ url: '/api/v1/index' });

    expect(response.json()).toEqual({ message: 'ok' });
  });

  it('should throw an error while bootstrap application', async () => {
    const fastifyInstance = await import('fastify').then((m) => m.fastify());

    await expect(
      fastifyInstance.register(bootstrap, {
        directory: new URL('mocks/controllers', import.meta.url),
        mask: /\.ts/,
      }),
    ).rejects.toThrow('Loaded file is incorrect module and can not be bootstrapped: undefined');
  });

  it('should skip broken controller', async () => {
    const fastifyInstance = await import('fastify').then((m) => m.fastify());

    await fastifyInstance.register(bootstrap, {
      directory: new URL('mocks/controllers', import.meta.url),
      mask: /\.ts/,
      skipBroken: true,
    });

    const response1 = await fastifyInstance.inject({ url: '/index' });
    const response2 = await fastifyInstance.inject({ url: '/broken' });

    expect(response1.json()).toEqual({ message: 'ok' });
    expect(response2.statusCode).toBe(404);
  });

  it('should throw error when class loader defined by some library and specified in config', async () => {
    const fastifyInstance = await import('fastify').then((m) => m.fastify());

    fastifyInstance.decorate(CLASS_LOADER, (c: Constructable) => new c());

    await expect(() =>
      fastifyInstance.register(bootstrap, {
        controllers: [],
        classLoader: (constructor) => new constructor(),
      }),
    ).rejects.toThrow('Some library already defines class loader, passing custom class loader via config impossible');
  });
});
