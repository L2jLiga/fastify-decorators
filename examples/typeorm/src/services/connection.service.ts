import { Service } from 'fastify-decorators';
import { join } from 'path';
import { createConnection } from 'typeorm/index';
import { Message } from '../entity/message';

@Service()
export class ConnectionService {
    connection = createConnection({
        type: 'sqljs',
        autoSave: true,
        location: join(process.cwd(), 'db', 'database.db'),
        entities: [
            Message,
        ],
        logging: ['query', 'schema'],
        synchronize: true
    });
}
