import { ErrorHandler } from '../../interfaces';
import { createErrorsHandler } from './create-errors-handler';

describe('Helpers: create errors handler', () => {
    it('should create error handler which will catch errors specified', () => {
        const expectedError = new Error('Smth went wrong');
        const errorHandlerDescription: ErrorHandler = {
            accepts(): boolean {
                return true;
            },
            handlerName: 'test'
        }
        const instance = {
            test(error: Error) {
                expect(error).toBe(expectedError);
            }
        };

        const handler = createErrorsHandler([errorHandlerDescription], instance);

        // @ts-expect-error set request and reply to nulls, this should not happens IRL
        return expect(handler(expectedError, null, null)).resolves.toBeUndefined();
    });

    it('should throw error when no handlers match', () => {
        const expectedError = new Error('Smth went wrong');
        const errorHandlerDescription: ErrorHandler = {
            accepts(): boolean {
                return false;
            },
            handlerName: 'test'
        }
        const instance = {};

        const handler = createErrorsHandler([errorHandlerDescription], instance);

        // @ts-expect-error set request and reply to nulls, this should not happens IRL
        return expect(handler(expectedError, null, null)).rejects.toEqual(expectedError);
    });

    it('should throw to next error handler when previous throws', () => {
        const expectedError = new Error('Smth went wrong');
        const errorHandlers: ErrorHandler[] = [
            {
                accepts(): boolean {
                    return true;
                },
                handlerName: 'throws'
            },
            {
                accepts(): boolean {
                    return true;
                },
                handlerName: 'catches'
            }
        ]
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

        // @ts-expect-error set request and reply to nulls, this should not happens IRL
        return expect(handler(expectedError, null, null)).resolves.toBeUndefined();
    });
});
