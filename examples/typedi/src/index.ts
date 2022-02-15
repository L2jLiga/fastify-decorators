import { useContainer } from '@fastify-decorators/typedi';
import { fastify } from 'fastify';
import { bootstrap } from 'fastify-decorators';
import { Container } from 'typedi';

useContainer(Container);

export const app = fastify();

app.register(bootstrap, {
  directory: import.meta.url,
});
