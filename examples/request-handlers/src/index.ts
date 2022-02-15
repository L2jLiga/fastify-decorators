import { fastify } from 'fastify';
import { bootstrap } from 'fastify-decorators';

export const app = fastify();

app.register(bootstrap, {
  directory: import.meta.url,
});
