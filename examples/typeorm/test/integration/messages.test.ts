import { app } from '../../src';
import { Message, MessageInput } from '../../src/entity/message';

describe('Messages CRUD test', () => {
    beforeEach(() => app.ready());

    let id: number;
    const input: MessageInput = {
        author: 'Me',
        text: 'Text',
    };

    beforeEach(async () => {
        const result = await app.inject({
            url: '/messages',
            method: 'POST',
            payload: input,
        });

        const body = result.json<Message>();
        id = body.id;
    });

    afterEach(async () => {
        await app.inject({
            url: `/messages/${id}`,
            method: 'DELETE',
        });
    });

    it('should be able to find message by id', async () => {
        const result = await app.inject(`/messages/${id}`);
        const body = result.json<Message>();

        expect(body.author).toEqual(input.author);
        expect(body.text).toEqual(input.text);
    });
});
