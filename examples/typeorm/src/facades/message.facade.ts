import { Initializer, Service } from '@fastify-decorators/simple-di';
import type { Repository } from 'typeorm';
import { Message } from '../entity/message.js';
import { DataSourceProvider } from '../services/dataSourceProvider.js';

@Service()
export class MessageFacade {
  private repository!: Repository<Message>;

  constructor(private dataSourceProvider: DataSourceProvider) {}

  @Initializer([DataSourceProvider])
  async init(): Promise<void> {
    // because we added DataSourceProvider as a dependency, we are sure it was properly initialized if it reaches
    // this point
    this.repository = this.dataSourceProvider.dataSource.getRepository(Message);
  }

  async getMessages(): Promise<Message[]> {
    return this.repository.find();
  }

  async getMessageBy(id: number): Promise<Message | null> {
    return this.repository.findOne({ where: { id } });
  }

  async storeMessage(message: Partial<Message>): Promise<Message> {
    return this.repository.save(message);
  }

  async deleteBy(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
