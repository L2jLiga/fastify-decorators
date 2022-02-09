import { fastify } from 'fastify';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { bootstrap } from './bootstrap.js';
import SampleControllerMock from './mocks/controllers/sample.controller.mock.js';

describe('Bootstrap test', () => {
  it('should autoload controller when path given', async () => {
    const instance = fastify();
    instance.register(bootstrap, {
      directory: resolve(dirname(fileURLToPath(import.meta.url)), 'mocks'),
      mask: /\.controller\.mock\.ts/,
    });

    const res = await instance.inject({ url: '/index' });

    expect(res.payload).toBe('{"message":"ok"}');
  });

  it('should autoload controller when URL given', async () => {
    const instance = fastify();
    instance.register(bootstrap, {
      directory: new URL('mocks', import.meta.url),
      mask: /\.controller\.mock\.ts/,
    });

    const res = await instance.inject({ url: '/index' });

    expect(res.payload).toBe('{"message":"ok"}');
  });

  it('should bootstrap request handler', async () => {
    const instance = fastify();
    instance.register(bootstrap, {
      directory: new URL('mocks', import.meta.url),
      mask: /\.handler\.mock\.ts/,
    });

    const res = await instance.inject({ url: '/index' });

    expect(res.payload).toBe('{"message":"ok"}');
  });

  it('should be able to bootstrap when mask is string', async () => {
    const instance = fastify();
    instance.register(bootstrap, {
      directory: new URL('mocks', import.meta.url),
      mask: '.handler.mock.ts',
    });

    const res = await instance.inject({ url: '/index' });

    expect(res.payload).toBe('{"message":"ok"}');
  });

  it('should not bootstrap server when try to bootstrap controllers/handlers with same routes', async () => {
    const instance = fastify();
    instance.register(bootstrap, {
      directory: new URL('mocks', import.meta.url),
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

  it('should throw an error while bootstrap application', async () =>
    expect(
      fastify().register(bootstrap, {
        directory: new URL('mocks/controllers', import.meta.url),
        mask: /\.ts/,
      }),
    ).rejects.toThrow('Loaded file is incorrect module and can not be bootstrapped: undefined'));

  it('should skip broken controller', async () => {
    const instance = fastify();

    await instance.register(bootstrap, {
      directory: new URL('mocks/controllers', import.meta.url),
      mask: /\.ts/,
      skipBroken: true,
    });

    const res1 = await instance.inject({ url: '/index' });
    const res2 = await instance.inject({ url: '/broken' });

    expect(res1.payload).toBe('{"message":"ok"}');
    expect(res2.statusCode).toBe(404);
  });
});
