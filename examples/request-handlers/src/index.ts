import { fastify } from 'fastify';
import { bootstrap } from 'fastify-decorators';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const app = fastify();

const __dirname = dirname(fileURLToPath(import.meta.url));

app.register(bootstrap, {
  directory: __dirname,
});
