import { FastifyInstance } from 'fastify';
import { configureControllerTest, ServiceMock } from 'fastify-decorators/testing';
import SimpleController from '../../../src/controllers/simple.controller';
import { MessageService } from '../../../src/services/message-service';

describe('Controller: SimpleController', () => {
    let instance: FastifyInstance;

    const messageService = { getMessage: jest.fn() };
    const mockMessageService: ServiceMock = {
        provide: MessageService,
        useValue: messageService,
    };

    beforeEach(async () => instance = await configureControllerTest({
        controller: SimpleController,
        mocks: [mockMessageService],
    }));
    afterEach(() => jest.restoreAllMocks());

    it('should return message from service when GET /test', async () => {
        messageService.getMessage.mockReturnValue('message');

        const result = await instance.inject('/demo/test');

        expect(result.statusCode).toBe(200);
        expect(result.body).toBe('{"message":"message"}');
    });

    it('should set X-Powered-By header to node for all requests', async () => {
        const result = await Promise.all([
            instance.inject('/demo/test'),
            instance.inject('/demo'),
        ]);

        expect(result.every(res => res.headers['x-powered-by'] === 'nodejs')).toBe(true);
    });
});
