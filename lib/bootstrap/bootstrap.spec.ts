import fastify = require('fastify');
import { join } from 'path';
import { bootstrap } from './bootstrap';

describe('Bootstrap test', () => {
    it('should bootstrap controller', async () => {
        const instance = fastify();
        instance.register(bootstrap, {
            directory: join(__dirname, 'controllers'),
            mask: /\.controller\.mock\./
        });

        const res = await instance.inject({ url: '/index' });

        expect(res.payload).toBe('{"message":"ok"}');
    });
});
