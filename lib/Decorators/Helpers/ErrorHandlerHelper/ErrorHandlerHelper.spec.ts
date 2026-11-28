import ErrorHandlerHelper from './ErrorHandlerHelper.js';
import { IErrorHandler } from '../../../Interfaces/controller.js';

describe('Helpers: create errors handler', () => {
  it('should create error handler which will catch errors specified', () => {
    const expectedError = new Error('Smth went wrong');
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

    const handler = ErrorHandlerHelper.create([errorHandlerDescription], instance);
    return expect(handler(expectedError, null, null)).resolves.toBeUndefined();
  });

  it('should throw error when no handlers match', () => {
    const expectedError = new Error('Smth went wrong');
    const errorHandlerDescription: IErrorHandler = {
      accepts(): boolean {
        return false;
      },
      handlerName: 'test',
    };
    const instance = {};

    const handler = ErrorHandlerHelper.create([errorHandlerDescription], instance);

    return expect(handler(expectedError, null, null)).rejects.toEqual(expectedError);
  });

  it('should throw to next error handler when previous throws', () => {
    const expectedError = new Error('Smth went wrong');
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

    const handler = ErrorHandlerHelper.create(errorHandlers, instance);

    return expect(handler(expectedError, null, null)).resolves.toBeUndefined();
  });
});
