import { Destructor, Initializer, Service } from '@fastify-decorators/simple-di';
import * as fs from 'node:fs';
import { join } from 'node:path';
import { DataSource } from 'typeorm';
import { Message } from '../entity/message.js';

@Service()
export class DataSourceProvider {
  constructor() {
    fs.mkdirSync(join(process.cwd(), 'db'), { recursive: true });
  }

  private _dataSource = new DataSource({
    type: 'sqlite',
    database: join(process.cwd(), 'db', 'database.db'),
    entities: [Message],
    logging: false,
    synchronize: true,
  });

  public get dataSource(): DataSource {
    return this._dataSource;
  }

  @Initializer()
  async init(): Promise<void> {
    await this._dataSource.initialize();
  }

  @Destructor()
  async destroy(): Promise<void> {
    await this._dataSource.destroy();
  }
}
