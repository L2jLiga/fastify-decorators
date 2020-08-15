import { FastifyInstance } from 'fastify';
import { configureControllerTest } from 'fastify-decorators/testing';
import ErrorController from '../../src/error.controller';

describe('Controller: error controller unit test', () => {
    let app: FastifyInstance;

    beforeEach(async () => {
        app = await configureControllerTest({ controller: ErrorController })
    })

    it('should reply with message when message was sent', async () => {
        const message = 'Hello world!';

        const result = await app.inject({
            url: '/error',
            method: "POST",
            payload: { message }
        });

        expect(result.statusCode).toBe(200);
        expect(result.payload).toEqual(message);
    });

    it('should reply with error message when error was sent', async () => {
        const error = 'Goodbye cruel world!';

        const result = await app.inject({
            url: '/error',
            method: "POST",
            payload: { error }
        });

        expect(result.statusCode).toBe(422);
        expect(await result.json()).toEqual({ message: error });
    });
});
