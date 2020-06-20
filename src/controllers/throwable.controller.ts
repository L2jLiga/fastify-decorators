import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, ErrorHandler, GET } from 'fastify-decorators';

class CustomError extends Error {
}

@Controller('/throwable')
export default class ThrowableController {
    @GET('/type-error')
    async typeError() {
        throw new TypeError('method throws TypeError!');
    }

    @GET('/syntax-error')
    async syntaxError() {
        throw new SyntaxError('method throws SyntaxError!');
    }

    @GET('/error')
    async error() {
        throw new Error('method throws generic Error!');
    }

    @GET('/error-with-code')
    async errorWithCode() {
        const error = new Error('error with code thrown') as Error & { code: string };
        error.code = 'ERROR_CODE';

        throw error;
    }

    @GET('/custom-error')
    async customError() {
        throw new CustomError('custom error thrown');
    }

    @ErrorHandler(SyntaxError)
    async handleSyntaxError(error: SyntaxError) {
        throw new CustomError(error.message);
    }

    @ErrorHandler(TypeError)
    handleTypeError(error: TypeError) {
        throw new CustomError(error.message);
    }

    @ErrorHandler('ERROR_CODE')
    handleErrorByCode(error: Error & { code: string }, request: FastifyRequest, reply: FastifyReply) {
        reply.status(503).send({
            code: error.code,
            message: error.message,
        });
    }

    @ErrorHandler()
    genericHandler(error: Error, request: FastifyRequest, reply: FastifyReply) {
        reply.status(500).send({
            message: error.message,
        });
    }
}
