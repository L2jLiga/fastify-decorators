import { useContainer } from '@fastify-decorators/typedi';
import { fastify } from 'fastify';
import { bootstrap } from 'fastify-decorators';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Container } from 'typedi';

useContainer(Container);

export const app = fastify();

app.register(bootstrap, {
  directory: dirname(fileURLToPath(import.meta.url)),
});
