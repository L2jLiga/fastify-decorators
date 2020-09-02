import { Service } from 'fastify-decorators';
import * as fs from 'fs';
import { join } from 'path';
import { createConnection } from 'typeorm';
import { Message } from '../entity/message';

@Service()
export class ConnectionService {
    constructor() {
        fs.mkdirSync(join(process.cwd(), 'db'), { recursive: true });
    }

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
