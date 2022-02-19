import { fastify } from 'fastify';
import { bootstrap } from 'fastify-decorators';
import fastifyStatic from 'fastify-static';
import fastifySwagger from 'fastify-swagger';
import 'reflect-metadata';
import { hostname, port } from './config.js';
import { MessageController } from './controllers/message.controller.js';

export const app = fastify();

// @ts-expect-error fastify v4 not officially supported by fastify-swagger (yet)
fastifySwagger[Symbol.for('plugin-meta')].fastify = '^4.0.0-alpha.0';
// @ts-expect-error fastify v4 not officially supported by fastify-static (yet)
fastifyStatic[Symbol.for('plugin-meta')].fastify = '^4.0.0-alpha.0';

app.register(fastifySwagger, {
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
  controllers: [MessageController],
});
