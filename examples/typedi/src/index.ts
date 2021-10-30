import { useContainer } from '@fastify-decorators/typedi';
import { fastify } from 'fastify';
import { bootstrap } from 'fastify-decorators';
import { dirname } from 'path';
import { Container } from 'typedi';
import { fileURLToPath } from 'url';

useContainer(Container);

export const app = fastify();

app.register(bootstrap, {
  directory: dirname(fileURLToPath(import.meta.url)),
});
