import { FastifyReply, FastifyRequest } from 'fastify';
import { ErrorHandler, POST, RequestHandler } from 'fastify-decorators';

@POST('/')
export default class RequestErrorHandler extends RequestHandler<any, any, any, { Body: { error?: string; message?: string } }> {

    handle(): Promise<string | never> {
        this.request.body.message;
        return typeof this.request.body.message === 'string'
            ? Promise.resolve(this.request.body.message)
            : Promise.reject(this.request.body.error);
    }

    @ErrorHandler()
    errorHandler(error: Error, request: FastifyRequest, reply: FastifyReply): void {
        reply.status(422).send({ message: `${error}` });
    }
}
