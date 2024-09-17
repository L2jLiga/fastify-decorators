import 'reflect-metadata';
import { fastify, FastifyPluginAsync } from 'fastify';
import { bootstrap, BootstrapConfig } from 'fastify-decorators';

export const app = fastify();

const host = '127.0.0.1';
const port = 3001;

app.register(bootstrap as unknown as FastifyPluginAsync<BootstrapConfig>, {
  directory: __dirname,
});

if (require.main == null) {
  app.listen({ host, port }, (error, address) => {
    if (error != null) {
      console.error(error);
      process.exit(-1);
    }
    console.log(`Application start and listening at ${address}`);
    console.log(`Available routes: \n${app.printRoutes()}`);
  });
}
