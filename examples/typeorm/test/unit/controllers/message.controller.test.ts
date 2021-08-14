import { FastifyInstance } from 'fastify';
import { configureControllerTest } from '@fastify-decorators/simple-di/testing';
import { MessageController } from '../../../src/controllers/message.controller.js';
import { MessageFacade } from '../../../src/facades/message.facade.js';

describe('Controller: Message Controller', () => {
  let instance: FastifyInstance;
  let facade: Record<keyof MessageFacade, jest.Mock>;

  beforeEach(async () => {
    facade = {
      init: jest.fn(),
      getMessages: jest.fn(),
      getMessageBy: jest.fn(),
      storeMessage: jest.fn(),
      deleteBy: jest.fn(),
    };

    instance = await configureControllerTest({
      controller: MessageController,
      mocks: [
        {
          provide: MessageFacade,
          useValue: facade,
        },
      ],
    });
  });

  it('should return all messages', async () => {
    facade.getMessages.mockReturnValue(Promise.resolve([{ id: 1, author: 'Admin', text: 'Test' }]));

    const result = await instance.inject('/messages');

    expect(result.json()).toEqual([{ id: 1, author: 'Admin', text: 'Test' }]);
  });

  it('should omit extra properties from response', async () => {
    facade.getMessages.mockReturnValue(
      Promise.resolve([
        {
          id: 1,
          author: 'Admin',
          text: 'Test',
          extra: 'some extra property',
        },
      ]),
    );

    const result = await instance.inject('/messages');

    expect(result.json()).toEqual([{ id: 1, author: 'Admin', text: 'Test' }]);
  });

  it('should find message by id', async () => {
    facade.getMessageBy.mockReturnValue(Promise.resolve({ id: 1, author: 'Admin', text: 'Test' }));

    const result = await instance.inject('/messages/1');

    expect(facade.getMessageBy).toHaveBeenCalledTimes(1);
    expect(facade.getMessageBy).toHaveBeenCalledWith(1);
    expect(result.json()).toEqual({ id: 1, author: 'Admin', text: 'Test' });
  });

  it('should throw error when message not found', async () => {
    facade.getMessageBy.mockReturnValue(Promise.resolve(null));

    const result = await instance.inject('/messages/1');

    expect(facade.getMessageBy).toHaveBeenCalledTimes(1);
    expect(facade.getMessageBy).toHaveBeenCalledWith(1);
    expect(result.statusCode).toBe(404);
    expect(result.json()).toEqual({ statusCode: 404, message: 'Entity not found' });
  });

  it('should create new entity and return it', async () => {
    facade.storeMessage.mockImplementation((it) => Promise.resolve(it));

    const result = await instance.inject({
      url: '/messages',
      method: 'POST',
      payload: { author: 'Lim', text: 'yellow', extra: 'data' },
    });

    expect(result.statusCode).toBe(200);
    expect(result.json()).toEqual({ author: 'Lim', text: 'yellow' });
  });
});
