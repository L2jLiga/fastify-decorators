import awsLambdaFastify from '@fastify/aws-lambda';
import { fastify } from 'fastify';
import { bootstrap } from 'fastify-decorators';
import { PingController } from './PingController.js';

export const app = fastify({ pluginTimeout: 90_000 });

app.register(bootstrap, {
  controllers: [PingController],
});

export const handler = awsLambdaFastify(app);
