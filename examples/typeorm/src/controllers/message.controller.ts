import { FastifyReply, FastifyRequest, FastifySchema, RouteSchema } from 'fastify';
import { Controller, DELETE, GET, POST } from 'fastify-decorators';
import { Message, MessageInput } from '../entity/message';
import { MessageFacade } from '../facades/message.facade';
import { messageInputSchema, messageSchema } from '../schemas/message.schema';

@Controller('/messages')
export class MessageController {
  constructor(private messageFacade: MessageFacade) {}

  @GET({
    url: '/',
    options: {
      schema: <RouteSchema & FastifySchema>{
        tags: ['messageController'],
        response: { 200: { type: 'array', items: messageSchema } },
      },
    },
  })
  getAll(): Promise<Message[]> {
    return this.messageFacade.getMessages();
  }

  @POST({
    url: '/',
    options: {
      schema: <RouteSchema & FastifySchema>{
        tags: ['messageController'],
        body: messageInputSchema,
        response: { 200: messageSchema },
      },
    },
  })
  async createOrUpdate(request: FastifyRequest<{ Body: MessageInput }>): Promise<Message> {
    return await this.messageFacade.storeMessage(request.body);
  }

  @GET({
    url: '/:id',
    options: {
      schema: <RouteSchema & FastifySchema>{
        tags: ['messageController'],
        params: { type: 'object', properties: { id: { type: 'number' } } },
        response: { 200: messageSchema },
      },
    },
  })
  async getById(request: FastifyRequest<{ Params: { id: number } }>): Promise<Message> {
    const message = await this.messageFacade.getMessageBy(request.params.id);

    if (!message) throw { statusCode: 404, message: 'Entity not found' };
    return message;
  }

  @DELETE({
    url: '/:id',
    options: {
      schema: <RouteSchema & FastifySchema>{
        tags: ['messageController'],
        params: { type: 'object', properties: { id: { type: 'number' } } },
      },
    },
  })
  async deleteById(request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply): Promise<void> {
    await this.messageFacade.deleteBy(request.params.id);

    reply.status(200).send();
  }
}
