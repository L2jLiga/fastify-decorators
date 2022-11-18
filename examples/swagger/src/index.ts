import fastifyStatic from '@fastify/static';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { fastify } from 'fastify';
import { bootstrap } from 'fastify-decorators';
import { hostname, port } from './config.js';
import { TypedController } from './typed.controller.js';

export const app = fastify({ pluginTimeout: 90_000 });

// @ts-expect-error fastify v4 not officially supported by fastify-static (yet)
fastifyStatic[Symbol.for('plugin-meta')].fastify = '^4.0.0-alpha.0';

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Test openapi',
      description: 'testing the fastify swagger api',
      version: '0.1.0',
    },
    servers: [{ url: `${hostname}:${port}` }],
  },
});
app.register(fastifySwaggerUi);

app.register(bootstrap, {
  controllers: [TypedController],
});
