import fastify = require('fastify');
import { join } from 'path';
import { bootstrap } from './bootstrap';

describe('Bootstrap test', () => {
    it('should bootstrap controller', async () => {
        const instance = fastify();
        instance.register(bootstrap, {
            directory: join(__dirname, 'mocks'),
            mask: /\.controller\.mock\.ts/
        });

        const res = await instance.inject({ url: '/index' });

        expect(res.payload).toBe('{"message":"ok"}');
    });

    it('should bootstrap request handler', async () => {
        const instance = fastify();
        instance.register(bootstrap, {
            directory: join(__dirname, 'mocks'),
            mask: /\.handler\.mock\.ts/,
        });

        const res = await instance.inject({ url: '/index' });

        expect(res.payload).toBe('{"message":"ok"}');
    });

    it('should not bootstrap server when try to bootstrap controllers/handlers with same routes', async () => {
        const instance = fastify();

        instance.register(bootstrap, {
            directory: join(__dirname, 'mocks'),
            mask: /\.mock\.ts/,
        });

        await expect(instance.inject({ url: '/index' })).rejects.toThrow();
    });
});
