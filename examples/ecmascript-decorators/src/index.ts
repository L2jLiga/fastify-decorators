import { fastify } from 'fastify';
import { bootstrap } from 'fastify-decorators';

export const app = fastify({ pluginTimeout: 90_000 });

app.register(bootstrap, {
  directory: import.meta.url,
});
