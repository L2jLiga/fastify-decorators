import { ErrorHandler, Handler, Hook } from '../../interfaces';
import { ERROR_HANDLERS, HANDLERS, HOOKS } from '../../symbols';
import {
    ensureErrorHandlers,
    ensureHandlers,
    ensureHooks,
    hasErrorHandlers,
    hasHandlers,
    hasHooks,
} from './class-properties';

describe('Helpers: class properties', () => {
    describe('ensure object has handlers symbol', () => {
        it('should create when not exists', () => {
            const obj = {};

            ensureHandlers(obj);

            expect(obj[HANDLERS]).toEqual([]);
        });

        it('should not create when exists', () => {
            const handlers: Handler[] = [];
            const obj = {
                [HANDLERS]: handlers,
            };

            ensureHandlers(obj);

            expect(obj[HANDLERS]).toBe(handlers);
        });
    });

    describe('check if handlers symbol exists', () => {
        it('should return false when not exists', () => {
            const obj = {};

            const result = hasHandlers(obj);

            expect(result).toBe(false);
        });

        it('should return true when exists', () => {
            const obj = {
                [HANDLERS]: [],
            };

            const result = hasHandlers(obj);

            expect(result).toBe(true);
        });
    });

    describe('ensure object has error handlers symbol', () => {
        it('should create when not exists', () => {
            const obj = {};

            ensureErrorHandlers(obj);

            expect(obj[ERROR_HANDLERS]).toEqual([]);
        });

        it('should not create when exists', () => {
            const errorHandlers: ErrorHandler[] = [];
            const obj = {
                [ERROR_HANDLERS]: errorHandlers,
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
                [ERROR_HANDLERS]: [],
            };

            const result = hasErrorHandlers(obj);

            expect(result).toBe(true);
        });
    });

    describe('ensure object has hooks symbol', () => {
        it('should create when not exists', () => {
            const obj = {};

            ensureHooks(obj);

            expect(obj[HOOKS]).toEqual([]);
        });

        it('should not create when exists', () => {
            const hooks: Hook[] = [];
            const obj = {
                [HOOKS]: hooks,
            };

            ensureHooks(obj);

            expect(obj[HOOKS]).toBe(hooks);
        });
    });

    describe('check if hooks symbol exists', () => {
        it('should return false when not exists', () => {
            const obj = {};

            const result = hasHooks(obj);

            expect(result).toBe(false);
        });

        it('should return true when exists', () => {
            const obj = {
                [HOOKS]: [],
            };

            const result = hasHooks(obj);

            expect(result).toBe(true);
        });
    });
});
