import { FastifyReply, FastifyRequest } from 'fastify';
import { ErrorHandler } from '../../interfaces';

export function createErrorsHandler(
    errorHandlers: ErrorHandler[], classInstance: any
): (error: Error, request: FastifyRequest, reply: FastifyReply) => Promise<void> {
    return async function errorHandler(error: Error, request: FastifyRequest, reply: FastifyReply) {
        for (const handler of errorHandlers) {
            if (handler.accepts(error)) {
                try {
                    await classInstance[handler.handlerName](error, request, reply);
                    return;
                } catch (e) {
                    error = e;
                }
            }
        }

        throw error;
    }
}
