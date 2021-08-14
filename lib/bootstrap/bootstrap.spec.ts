import { fastify } from 'fastify';
import { resolve } from 'path';
import { bootstrap } from './bootstrap.js';
import SampleControllerMock from './mocks/controllers/sample.controller.mock.js';

describe('Bootstrap test', () => {
  it('should bootstrap controller', async () => {
    const instance = fastify();
    instance.register(bootstrap, {
      directory: resolve(__dirname, 'mocks'),
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
});
