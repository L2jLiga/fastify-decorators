import type { FastifyReply, FastifyRequest } from 'fastify';
import type { IErrorHandler } from '../../../Interfaces/controller.js';

export default class {
  static create(
    handlers: Iterable<IErrorHandler>,
    instance: Record<string, (error: Error, request: FastifyRequest, reply: FastifyReply) => void>,
  ): ErrorHandler {
    return async function (error, request, reply) {
      for (const handler of handlers) {
        if (handler.accepts(error)) {
          try {
            //@ts-expect-error TODO: passing null to error handlers must be investigated
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
}

/**
 * Setting request,reply to null to get around this typescript error:
 * //@ts-expect-error set request and reply to nulls, this should not happens IRL
 */
type ErrorHandler = (error: Error, request: FastifyRequest | null, reply: FastifyReply | null) => Promise<void>;
