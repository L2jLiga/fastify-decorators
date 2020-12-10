import { Initializer, Service } from 'fastify-decorators';
import * as fs from 'fs';
import { join } from 'path';
import { Connection, createConnection } from 'typeorm';
import { Message } from '../entity/message.js';

@Service()
export class ConnectionService {
  private _connection!: Connection;

  constructor() {
    fs.mkdirSync(join(process.cwd(), 'db'), { recursive: true });
  }

  public get connection(): Connection {
    return this._connection;
  }

  @Initializer()
  async init(): Promise<void> {
    this._connection = await createConnection({
      type: 'sqljs',
      autoSave: true,
      location: join(process.cwd(), 'db', 'database.db'),
      entities: [Message],
      logging: ['query', 'schema'],
      synchronize: true,
    });
  }
}
