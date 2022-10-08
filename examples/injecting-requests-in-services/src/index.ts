import { fastify } from 'fastify';
import { bootstrap } from 'fastify-decorators';
import { TestController } from './controllers/TestController.js';

export const app = fastify({ pluginTimeout: 90_000 });

app.register(bootstrap, {
  controllers: [TestController],
});
