import { FastifyInstanceToken } from 'fastify-decorators';
import { configureServiceTest } from 'fastify-decorators/testing';
import { ServerService } from '../../../src/services/server-service';

describe('Service: ServerService', () => {
    let service: ServerService;

    const fastifyInstance = { printRoutes: jest.fn() };
    beforeEach(() => service = configureServiceTest({
        service: ServerService,
        mocks: [
            {
                provide: FastifyInstanceToken,
                useValue: fastifyInstance,
            },
        ],
    }));

    it('should return all routes', () => {
        service.printRoutes();

        expect(fastifyInstance.printRoutes).toHaveBeenCalled();
    });
});
