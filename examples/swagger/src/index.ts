import { fastify } from 'fastify';
import { bootstrap } from 'fastify-decorators';
import fastifyOAS from 'fastify-oas';
import { hostname, port } from './config.js';
import { TypedController } from './typed.controller.js';

export const app = fastify();

app.register(fastifyOAS, {
  swagger: {
    info: {
      title: 'Test openapi',
      description: 'testing the fastify swagger api',
      version: '0.1.0',
    },
    host: `${hostname}:${port}`,
    consumes: ['application/json'],
    produces: ['application/json'],
  },
  exposeRoute: true,
});
app.register(bootstrap, {
  controllers: [TypedController],
});
