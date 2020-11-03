import { fastify } from 'fastify';
import { bootstrap } from 'fastify-decorators';
import fastifyOAS from 'fastify-oas';
import 'reflect-metadata';
import { MessageController } from './controllers/message.controller';

export const app = fastify();

const address = '127.0.0.1';
const port = 3003;

app.register(fastifyOAS, {
    swagger: {
        info: {
            title: 'Test openapi',
            description: 'testing the fastify swagger api',
            version: '0.1.0',
        },
        host: `${address}:${port}`,
        consumes: ['application/json'],
        produces: ['application/json'],
    },
    exposeRoute: true,
});

app.register(bootstrap, {
    controllers: [
        MessageController,
    ],
});

if (module.parent == null) {
    app.listen(port, address, (error, address) => {
        if (error != null) {
            console.error(error);
            process.exit(-1);
        }
        console.log(`Application start and listening at ${address}`);
        console.log(`Documentation available at ${address}/documentation`);
        console.log(`Available routes: \n${app.printRoutes()}`);
    });
}
