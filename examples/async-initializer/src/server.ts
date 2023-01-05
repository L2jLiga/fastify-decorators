import Fastify, { FastifyServerOptions } from 'fastify';

import { bootstrap } from 'fastify-decorators';

export const createServerInstance = (options: FastifyServerOptions = {}) => {
  const instance = Fastify(options);

  instance.register(bootstrap, {
    directory: import.meta.url,
    mask: /\.(controller|handler)\./,
  });

  return instance;
};

export default createServerInstance;
