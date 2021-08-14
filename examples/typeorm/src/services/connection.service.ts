import { Destructor, Initializer, Service } from '@fastify-decorators/simple-di';
import * as fs from 'fs';
import { join } from 'path';
import { Connection, createConnection } from 'typeorm';
import { Message } from '../entity/message.js';

@Service()
export class ConnectionService {
  constructor() {
    fs.mkdirSync(join(process.cwd(), 'db'), { recursive: true });
  }

  private _connection!: Connection;

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
      logging: false,
      synchronize: true,
    });
  }

  @Destructor()
  async destroy(): Promise<void> {
    await this._connection.close();
  }
}
