import { FastifyReply, FastifyRequest } from 'fastify';
import { ControllerHandlersAndHooks } from '../interfaces';
import { CREATOR } from '../symbols';
import { ErrorHandler } from './error-handler';
import ErrnoException = NodeJS.ErrnoException;

describe('Decorators: @ErrorHandler', function () {
    it('should add annotated method to controller options', () => {
        class WithHandlers {
            static [CREATOR]: ControllerHandlersAndHooks<any, any, any>;

            @ErrorHandler(TypeError)
            public handleTypeError(error: TypeError, request: FastifyRequest, reply: FastifyReply) {
                throw new Error(error.message);
            }

            @ErrorHandler('HEADERS_ALREADY_SENT')
            public handleHeadersError(error: ErrnoException, request: FastifyRequest, reply: FastifyReply) {
                // nothing to do here
            }

            @ErrorHandler()
            public handleGenericError(error: Error, request: FastifyRequest, reply: FastifyReply) {
                reply.send({ message: error.message });
            }
        }

        expect(WithHandlers[CREATOR].errorHandlers.length).toBe(3);

        const [typeErrorHandler, headersErrorHandler, genericHandler] = WithHandlers[CREATOR].errorHandlers;
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
