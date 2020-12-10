import { Initializer, Service } from 'fastify-decorators';
import { Repository } from 'typeorm';
import { Message } from '../entity/message.js';
import { ConnectionService } from '../services/connection.service.js';

@Service()
export class MessageFacade {
  private repository!: Repository<Message>;

  constructor(private connectionService: ConnectionService) {}

  @Initializer([ConnectionService])
  async init(): Promise<void> {
    // because we added ConnectionService as a dependency, we are sure it was properly initialized if it reaches
    // this point
    this.repository = this.connectionService.connection.getRepository(Message);
  }

  async getMessages(): Promise<Message[]> {
    return this.repository.find();
  }

  async getMessageBy(id: number): Promise<Message | undefined> {
    return this.repository.findOne(id);
  }

  async storeMessage(message: Partial<Message>): Promise<Message> {
    return this.repository.save(message);
  }

  async deleteBy(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
