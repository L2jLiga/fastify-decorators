import { configureServiceTest } from '@fastify-decorators/simple-di/testing';
import { Repository } from 'typeorm';
import { Message } from '../../../src/entity/message.js';
import { MessageFacade } from '../../../src/facades/message.facade.js';
import { DataSourceProvider } from '../../../src/services/data-source.provider.js';
import { jest } from '@jest/globals';

interface MockRepository {
  find: jest.Mock<Repository<Message>['find']>;
  findOne: jest.Mock<Repository<Message>['findOne']>;
  save: jest.Mock<Repository<Message>['save']>;
}

interface MockConnection {
  getRepository(): MockRepository;

  close: jest.Mock;
}

describe('Facade: MessageFacade', () => {
  let facade: MessageFacade;
  let repository: MockRepository;

  beforeEach(async () => {
    repository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
    } as MockRepository;

    facade = configureServiceTest({
      service: MessageFacade,
      mocks: [
        {
          provide: DataSourceProvider,
          useValue: {
            dataSource: {
              getRepository: () => repository,
              close: jest.fn(),
            } as MockConnection,
          } as Record<keyof DataSourceProvider, MockConnection>,
        },
      ],
    });

    await facade.init();
  });

  it('should return all messages', async () => {
    repository.find.mockImplementation(() => Promise.resolve([{ id: 332, author: 'Me', text: 'yep' }]));

    const result = await facade.getMessages();

    expect(result).toEqual([{ id: 332, author: 'Me', text: 'yep' }]);
  });

  it('should return message by id', async () => {
    repository.findOne.mockImplementation(({ where: { id } }: { where: { id: number } }) => Promise.resolve({ id, author: 'Me', text: 'yep' }));

    const result = await facade.getMessageBy(55);

    expect(result).toEqual({ id: 55, author: 'Me', text: 'yep' });
  });

  it('should create message', async () => {
    repository.save.mockImplementation((it) => Promise.resolve({ id: 1, ...it }));

    const result = await facade.storeMessage({ text: 'test', author: 'test' });

    expect(result).toEqual({ id: 1, text: 'test', author: 'test' });
  });
});
