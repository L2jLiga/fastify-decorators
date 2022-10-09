import { FastifyReply, FastifyRequest } from 'fastify';
import { IErrorHandler } from '../../interfaces/index.js';
import { createErrorsHandler } from './create-errors-handler.js';

describe('Helpers: create errors handler', () => {
  it('should create error handler which will catch errors specified', () => {
    const expectedError = new Error('Something went wrong');
    const errorHandlerDescription: IErrorHandler = {
      accepts(): boolean {
        return true;
      },
      handlerName: 'test',
    };
    const instance = {
      test(error: Error) {
        expect(error).toBe(expectedError);
      },
    };

    const handler = createErrorsHandler([errorHandlerDescription], instance);

    return expect(handler(expectedError, {} as FastifyRequest, {} as FastifyReply)).resolves.toBeUndefined();
  });

  it('should throw error when no handlers match', () => {
    const expectedError = new Error('Something went wrong');
    const errorHandlerDescription: IErrorHandler = {
      accepts(): boolean {
        return false;
      },
      handlerName: 'test',
    };
    const instance = {};

    const handler = createErrorsHandler([errorHandlerDescription], instance);

    return expect(handler(expectedError, {} as FastifyRequest, {} as FastifyReply)).rejects.toEqual(expectedError);
  });

  it('should throw to next error handler when previous throws', () => {
    const expectedError = new Error('Something went wrong');
    const errorHandlers: IErrorHandler[] = [
      {
        accepts(): boolean {
          return true;
        },
        handlerName: 'throws',
      },
      {
        accepts(): boolean {
          return true;
        },
        handlerName: 'catches',
      },
    ];
    const instance = {
      throws(error: Error) {
        expect(error).toBe(expectedError);
        throw error;
      },
      catches(error: Error) {
        expect(error).toBe(expectedError);
      },
    };

    const handler = createErrorsHandler(errorHandlers, instance);

    return expect(handler(expectedError, {} as FastifyRequest, {} as FastifyReply)).resolves.toBeUndefined();
  });
});
