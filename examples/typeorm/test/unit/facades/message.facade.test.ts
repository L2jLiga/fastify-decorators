import { configureServiceTest } from 'fastify-decorators/testing';
import { MessageFacade } from '../../../src/facades/message.facade';
import { ConnectionService } from '../../../src/services/connection.service';

interface MockRepository {
    find: jest.Mock
    findOne: jest.Mock
    save: jest.Mock
}

interface MockConnection {
    getRepository(): MockRepository

    close: jest.Mock
}

describe('Facade: MessageFacade', () => {
    let facade: MessageFacade;
    let repository: MockRepository;

    beforeEach(async () => {
        repository = {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
        };
        facade = configureServiceTest({
            service: MessageFacade,
            mocks: [{
                provide: ConnectionService,
                useValue: {
                    connection: {
                        getRepository: () => repository,
                        close: jest.fn(),
                    },
                } as Record<keyof ConnectionService, MockConnection>,
            }],
        });

        await facade.init();
    });

    it('should return all messages', async () => {
        repository.find.mockImplementation(() => Promise.resolve([{ id: 332, author: 'Me', text: 'yep' }]));

        const result = await facade.getMessages();

        expect(result).toEqual([{ id: 332, author: 'Me', text: 'yep' }]);
    });

    it('should return message by id', async () => {
        repository.findOne.mockImplementation((id: number) => Promise.resolve({ id, author: 'Me', text: 'yep' }));

        const result = await facade.getMessageBy(55);

        expect(result).toEqual({ id: 55, author: 'Me', text: 'yep' });
    });

    it('should create message', async () => {
        repository.save.mockImplementation(it => Promise.resolve({ id: 1, ...it }));

        const result = await facade.storeMessage({ text: 'test', author: 'test' });

        expect(result).toEqual({ id: 1, text: 'test', author: 'test' });
    });
});
