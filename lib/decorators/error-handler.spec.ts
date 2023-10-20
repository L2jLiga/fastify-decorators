import { FastifyReply, FastifyRequest } from 'fastify';
import { ErrorHandler } from './error-handler.js';
import { getErrorHandlerContainer } from './helpers/class-metadata.js';
import ErrnoException = NodeJS.ErrnoException;

describe('Decorators: @IErrorHandler', function () {
  it('should add annotated method to controller options', () => {
    class WithHandlers {
      @ErrorHandler(TypeError)
      public handleTypeError(error: TypeError) {
        throw new Error(error.message);
      }

      @ErrorHandler('HEADERS_ALREADY_SENT')
      public handleHeadersError() {
        // nothing to do here
      }

      @ErrorHandler()
      public handleGenericError(error: Error, request: FastifyRequest, reply: FastifyReply) {
        reply.send({ message: error.message });
      }
    }

    expect(getErrorHandlerContainer(WithHandlers)).toBe(3);

    const [typeErrorHandler, headersErrorHandler, genericHandler] = getErrorHandlerContainer(WithHandlers);
    expect(typeErrorHandler.accepts(undefined)).toBe(false);
    expect(typeErrorHandler.accepts(new Error())).toBe(false);
    expect(typeErrorHandler.accepts(new TypeError())).toBe(true);
    expect(headersErrorHandler.accepts(undefined)).toBe(false);
    expect(headersErrorHandler.accepts(new Error())).toBe(false);
    expect(headersErrorHandler.accepts(new TypeError())).toBe(false);
    expect(headersErrorHandler.accepts(<ErrnoException>{ code: 'HEADERS_ALREADY_SENT' })).toBe(true);
    expect(genericHandler.accepts(undefined)).toBe(true);
    expect(genericHandler.accepts(new Error())).toBe(true);
    expect(genericHandler.accepts(new TypeError())).toBe(true);
    expect(genericHandler.accepts(new SyntaxError())).toBe(true);
    expect(genericHandler.accepts(<ErrnoException>{ code: 'HEADERS_ALREADY_SENT' })).toBe(true);
  });
});
