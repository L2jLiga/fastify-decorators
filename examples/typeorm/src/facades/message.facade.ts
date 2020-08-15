import { Service } from 'fastify-decorators';
import { Message } from '../entity/message';
import { ConnectionService } from '../services/connection.service';

@Service()
export class MessageFacade {
    constructor(private connectionService: ConnectionService) {
    }

    private repository = this.connectionService.connection.then(connection => connection.getRepository(Message));

    async getMessages(): Promise<Message[]> {
        const repository = await this.repository;
        return repository.find();
    }

    async getMessageBy(id: number): Promise<Message | undefined> {
        const repository = await this.repository;

        return repository.findOne(id);
    }

    async storeMessage(message: Partial<Message>): Promise<Message> {
        const repository = await this.repository;

        return repository.save(message);
    }

    async deleteBy(id: number): Promise<void> {
        const repository = await this.repository;

        await repository.delete(id);
    }
}
