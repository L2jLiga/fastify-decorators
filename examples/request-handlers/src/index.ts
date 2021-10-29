import { fastify } from 'fastify';
import { bootstrap } from 'fastify-decorators';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

export const app = fastify();

const __dirname = dirname(fileURLToPath(import.meta.url));

app.register(bootstrap, {
  directory: __dirname,
});
