import fastify from 'fastify';
import { join } from 'path';
import { Connection, createConnection, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { CrudController } from '../src/controllers/crud-controller';

describe('Decorators: CrudController', () => {
  let connection: Connection;

  @Entity()
  class EntitySubImpl {
    @PrimaryColumn()
    field!: string;
  }

  @Entity()
  class EntityImpl {
    @OneToOne<EntitySubImpl>('EntitySubImpl', { eager: true })
    @JoinColumn()
    sub!: EntitySubImpl;

    @PrimaryColumn()
    field!: string;
  }

  beforeEach(async () => {
    connection = await createConnection({
      type: 'sqljs',
      autoSave: true,
      location: join(__dirname, 'database.db'),
      entities: [EntityImpl, EntitySubImpl],
      logging: ['query', 'schema'],
      synchronize: true,
    });
  });
  afterEach(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it(`should register schemas for controller entity and all related entities`, async () => {
    @CrudController(EntityImpl, '/')
    class Ctrl {}

    const app = fastify();
    app.decorate('connection', connection);

    // @ts-expect-error implicitly created property
    Ctrl[Symbol.for('fastify-decorators.creator')].register(app, new Map(), true);

    const schemas = app.getSchemas();

    expect(schemas['/models/EntitySubImpl']).toEqual({
      $id: '/models/EntitySubImpl',
      $schema: 'http://json-schema.org/draft-07/schema#',
      definitions: {
        entity: {
          type: 'object',
          properties: {
            field: {
              type: 'string',
              title: 'field',
              readOnly: false,
              writeOnly: false,
              nullable: false,
              _options: {
                generated: false,
                hidden: false,
              },
            },
          },
        },
      },
    });
    expect(schemas['/models/EntityImpl']).toEqual({
      $id: '/models/EntityImpl',
      $schema: 'http://json-schema.org/draft-07/schema#',
      definitions: {
        entity: {
          type: 'object',
          properties: {
            field: {
              type: 'string',
              title: 'field',
              readOnly: false,
              writeOnly: false,
              nullable: false,
              _options: {
                generated: false,
                hidden: false,
              },
            },
            sub: {
              oneOf: [{ $ref: '/models/EntitySubImpl#/definitions/entity' }, { type: 'null' }],
            },
          },
        },
      },
    });

    const response = await app.inject('/');

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual([]);
  });

  it('should reply with data', async () => {
    const entitySub = new EntitySubImpl();
    entitySub.field = 'joined';

    const entity = new EntityImpl();
    entity.field = 'parent';
    entity.sub = entitySub;

    @CrudController(EntityImpl, '/')
    class Ctrl {}

    const app = fastify();
    app.decorate('connection', connection);

    // @ts-expect-error implicitly created property
    Ctrl[Symbol.for('fastify-decorators.creator')].register(app, new Map(), true);

    await connection.manager.save([entitySub, entity]);

    const response = await app.inject('/');

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(<EntityImpl[]>[
      {
        field: 'parent',
        sub: {
          field: 'joined',
        },
      },
    ]);
  });
});
