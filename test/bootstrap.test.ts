import fastify = require('fastify');
import { join } from 'path';
import { bootstrap } from '../lib';

const tap = require('tap');

tap.test('Should bootstrap handlers', async (t: any) => {
    const instance = fastify();

    instance.register(bootstrap, {
        handlersDirectory: join(__dirname, 'handlers'),
        prefix: '/sample'
    });

    const res = await instance.inject({
        url: `/sample/get`
    });

    t.match(res.payload, `{"message":"OK!"}`);
});
