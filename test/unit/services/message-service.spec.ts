import { MessageService } from '../../../src/services/message-service';

describe('Service: MessageService', () => {
    let service: MessageService;

    beforeEach(() => service = new MessageService());

    it('should return message', () => {
        const message = service.getMessage();

        expect(message).toBe('Service works!');
    });
});
