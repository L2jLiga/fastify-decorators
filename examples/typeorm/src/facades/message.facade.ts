import { Initializer, Service } from 'fastify-decorators';
import { Message } from '../entity/message';
import { ConnectionService } from '../services/connection.service';
import { Repository } from "typeorm/index";

@Service()
export class MessageFacade {
    private repository!: Repository<Message>;
    constructor(private connectionService: ConnectionService) {
    }

    @Initializer([ConnectionService])
    async init() {
        console.log("CALLED MESSAGE");
        this.repository = this.connectionService.connection.getRepository(Message);
        console.log("FINISH MESSAGE");
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
