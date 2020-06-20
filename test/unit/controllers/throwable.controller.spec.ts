import { FastifyInstance } from 'fastify';
import { configureControllerTest } from 'fastify-decorators/testing';
import ThrowableController from '../../../src/controllers/throwable.controller';

describe('Controller: SimpleController', () => {
    let instance: FastifyInstance;

    beforeEach(async () => instance = await configureControllerTest({
        controller: ThrowableController,
    }));
    afterEach(() => jest.restoreAllMocks());

    it('should handle type error', async () => {
        const result = await instance.inject('/throwable/type-error');

        expect(result.statusCode).toBe(500);
        expect(result.body).toBe('{"message":"method throws TypeError!"}');
    });

    it('should handle syntax error', async () => {
        const result = await instance.inject('/throwable/syntax-error');

        expect(result.statusCode).toBe(500);
        expect(result.body).toBe('{"message":"method throws SyntaxError!"}');
    });

    it('should handle generic error', async () => {
        const result = await instance.inject('/throwable/error');

        expect(result.statusCode).toBe(500);
        expect(result.body).toBe('{"message":"method throws generic Error!"}');
    });

    it('should handle error with code', async () => {
        const result = await instance.inject('/throwable/error-with-code');

        expect(result.statusCode).toBe(503);
        expect(result.body).toBe('{"code":"ERROR_CODE","message":"error with code thrown"}');
    });

    it('should handle custom error', async () => {
        const result = await instance.inject('/throwable/custom-error');

        expect(result.statusCode).toBe(500);
        expect(result.body).toBe('{"message":"custom error thrown"}');
    });
});
