import type { FastifyReply, FastifyRequest } from 'fastify';
import { IErrorHandler } from '../../interfaces/index.js';

export function createErrorsHandler(
  errorHandlers: Iterable<IErrorHandler>,
  instance: Record<string, (error: Error, request: FastifyRequest, reply: FastifyReply) => void>,
): (error: Error, request: FastifyRequest, reply: FastifyReply) => Promise<void> {
  return async function errorHandler(error: Error, request: FastifyRequest, reply: FastifyReply): Promise<void> {
    for (const handler of errorHandlers) {
      if (handler.accepts(error)) {
        try {
          await instance[handler.handlerName as string](error, request, reply);
          return;
        } catch (e) {
          error = e as Error;
        }
      }
    }

    throw error;
  };
}
