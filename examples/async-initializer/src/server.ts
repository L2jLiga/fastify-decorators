import Fastify, { FastifyServerOptions } from 'fastify';

import { bootstrap } from 'fastify-decorators';
import path from 'path';
import 'reflect-metadata';

export const createServerInstance = (options: FastifyServerOptions = {}) => {
  const instance = Fastify(options);

  instance.register(bootstrap, {
    directory: path.resolve(__dirname, '.'),
    mask: /\.(controller|handler)\./,
  });

  return instance;
};

export default createServerInstance;
