import { fastify } from 'fastify';
import { bootstrap } from 'fastify-decorators';
import { TestController } from './controllers/TestController.js';

export const app = fastify();

app.register(bootstrap, {
  controllers: [TestController],
});
