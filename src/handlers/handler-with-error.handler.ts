import { FastifyReply, FastifyRequest } from 'fastify';
import { ErrorHandler, GET, RequestHandler } from 'fastify-decorators';

@GET('/handler-with-error')
export default class HandlerWithErrorHandler extends RequestHandler {
    public handle(): Promise<never> {
        return Promise.reject({ code: 'NOT_IMPLEMENTED' })
    }

    @ErrorHandler('NOT_IMPLEMENTED')
    handleNotImplemented(error: Error, request: FastifyRequest, reply: FastifyReply): void {
        reply.status(422).send({ message: 'Not implemented' });
    }
}
