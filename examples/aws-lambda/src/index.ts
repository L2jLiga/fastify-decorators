import awsLambdaFastify from 'aws-lambda-fastify';
import { fastify } from 'fastify';
import { bootstrap } from 'fastify-decorators';
import { PingController } from './PingController.js';

export const app = fastify();

app.register(bootstrap, {
  controllers: [PingController],
});

export const handler = awsLambdaFastify(app);
