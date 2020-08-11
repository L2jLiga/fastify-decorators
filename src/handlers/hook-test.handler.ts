import { FastifyReply, FastifyRequest } from 'fastify';
import { GET, Hook, RequestHandler } from 'fastify-decorators';

@GET('/handlers-with-hook')
export default class HookTestHandler extends RequestHandler {
    public handle(): Promise<string> {
        return Promise.resolve('here')
    }

    @Hook('onSend')
    async hidePoweredBy(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        reply.header('X-Powered-By', 'nodejs');
    }
}
