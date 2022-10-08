import { useContainer } from '@fastify-decorators/typedi';
import { fastify } from 'fastify';
import { bootstrap } from 'fastify-decorators';
import { Container } from 'typedi';

useContainer(Container);

export const app = fastify({ pluginTimeout: 90_000 });

app.register(bootstrap, {
  directory: import.meta.url,
});
