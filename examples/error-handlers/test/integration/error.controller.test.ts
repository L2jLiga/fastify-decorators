import { app } from '../../src';

describe('Handler: request error handler', () => {
    beforeEach(() => app.ready());

    it('should reply with message when message was sent', async () => {
        const message = 'Hello world!';

        const result = await app.inject({
            url: '/',
            method: "POST",
            payload: { message }
        });

        expect(result.statusCode).toBe(200);
        expect(result.payload).toEqual(message);
    });

    it('should reply with error message when error was sent', async () => {
        const error = 'Goodbye cruel world!';

        const result = await app.inject({
            url: '/',
            method: "POST",
            payload: { error }
        });

        expect(result.statusCode).toBe(422);
        expect(await result.json()).toEqual({ message: error });
    });
});
