import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, ErrorHandler, POST } from 'fastify-decorators';

@Controller('/error')
export default class ErrorController {
    @POST()
    handle(request: FastifyRequest<{ Body: { error?: string; message?: string } }>): Promise<string | never> {
        request.body.message;
        return typeof request.body.message === 'string'
            ? Promise.resolve(request.body.message)
            : Promise.reject(request.body.error);
    }

    @ErrorHandler()
    errorHandler(error: Error, request: FastifyRequest, reply: FastifyReply): void {
        reply.status(422).send({ message: `${error}` });
    }
}
