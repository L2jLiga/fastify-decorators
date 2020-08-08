import { ErrorHandler } from '../../interfaces';
import { ERROR_HANDLERS } from '../../symbols';
import { ensureErrorHandlers, hasErrorHandlers } from './class-properties';

describe('Helpers: class properties', () => {
    describe('ensure object has error handlers symbol', () => {
        it('should create when not exists', () => {
            const obj = {};

            ensureErrorHandlers(obj);

            expect(obj[ERROR_HANDLERS]).toEqual([]);
        });

        it('should not create when exists', () => {
            const errorHandlers: ErrorHandler[] = [];
            const obj = {
                [ERROR_HANDLERS]: errorHandlers
            };

            ensureErrorHandlers(obj);

            expect(obj[ERROR_HANDLERS]).toBe(errorHandlers);
        });
    });

    describe('check if error handlers symbol exists', () => {
        it('should return false when not exists', () => {
            const obj = {};

            const result = hasErrorHandlers(obj);

            expect(result).toBe(false);
        });

        it('should return true when exists', () => {
            const obj = {
                [ERROR_HANDLERS]: []
            };

            const result = hasErrorHandlers(obj);

            expect(result).toBe(true);
        });
    });
});
