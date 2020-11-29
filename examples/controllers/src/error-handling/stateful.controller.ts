import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, ControllerType, ErrorHandler, GET } from 'fastify-decorators';
import { ErrorType } from './error-type';

@Controller({
  route: '/stateful/error-handling',
  type: ControllerType.REQUEST,
})
export default class StatelessController {
  @GET({
    url: '/',
    options: { schema: { querystring: { type: 'object', properties: { errorType: { type: 'number' } } } } },
  })
  async getStateful(request: FastifyRequest<{ Querystring: { errorType: ErrorType } }>): Promise<never> {
    switch (request.query.errorType) {
      case ErrorType.GENERIC:
        throw new Error('Generic error happened');
      case ErrorType.CUSTOM:
        throw { code: 'CUSTOM_ERROR_CODE' };
      case ErrorType.SYNTAX:
        throw new SyntaxError('Syntax error happened');
      case ErrorType.TYPE:
        throw new TypeError('Type error happened');
    }
  }

  @ErrorHandler('CUSTOM_ERROR_CODE')
  customErrorHandler(error: Error, request: FastifyRequest, reply: FastifyReply): void {
    reply.status(503).send(error.message);
  }

  @ErrorHandler(TypeError)
  typeErrorHandler(error: TypeError, request: FastifyRequest, reply: FastifyReply): void {
    reply.status(502).send(error.message);
  }

  @ErrorHandler(SyntaxError)
  syntaxErrorHandler(error: SyntaxError, request: FastifyRequest, reply: FastifyReply): void {
    reply.status(501).send(error.message);
  }

  @ErrorHandler()
  genericErrorHandler(error: Error, request: FastifyRequest, reply: FastifyReply): void {
    reply.status(500).send(error.message);
  }
}
