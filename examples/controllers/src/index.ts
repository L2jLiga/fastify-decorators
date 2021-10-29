import { fastify } from 'fastify';
import { bootstrap } from 'fastify-decorators';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

export const app = fastify();

app.register(bootstrap, {
  directory: dirname(fileURLToPath(import.meta.url)),
});
