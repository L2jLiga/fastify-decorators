import { fastify } from 'fastify';
import { bootstrap } from 'fastify-decorators';
import * as path from 'path';
import { fileURLToPath } from 'url';

export const app = fastify();

app.register(bootstrap, {
  directory: path.dirname(fileURLToPath(import.meta.url)),
});
