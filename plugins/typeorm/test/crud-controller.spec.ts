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
      $schema: 'http://json-schema.org/schema#',
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
              _options: { generated: false, hidden: false },
            },
          },
        },
        query: {
          properties: {
            $or: { items: { $ref: '#/definitions/query' }, type: 'array' },
            field: {
              properties: {
                $between: { items: [{ type: 'string' }, { type: 'string' }], type: 'array' },
                $eq: { type: 'string' },
                $gt: { type: 'string' },
                $gte: { type: 'string' },
                $ilike: { type: 'string' },
                $in: { items: { type: 'string' }, type: 'array' },
                $like: { type: 'string' },
                $lt: { type: 'string' },
                $lte: { type: 'string' },
                $nbetween: { items: [{ type: 'string' }, { type: 'string' }], type: 'array' },
                $neq: { type: 'string' },
                $nilike: { type: 'string' },
                $nin: { items: { type: 'string' }, type: 'array' },
                $nlike: { type: 'string' },
                $nregex: { type: 'string' },
                $regex: { type: 'string' },
              },
              type: ['string', 'number', 'object'],
            },
          },
          type: 'object',
        },
      },
    });
    expect(schemas['/models/EntityImpl']).toEqual({
      $id: '/models/EntityImpl',
      $schema: 'http://json-schema.org/schema#',
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
              _options: { generated: false, hidden: false },
            },
            sub: { oneOf: [{ $ref: '/models/EntitySubImpl#/definitions/entity' }, { type: 'null' }] },
          },
        },
        query: {
          properties: {
            $or: { items: { $ref: '#/definitions/query' }, type: 'array' },
            field: {
              properties: {
                $between: { items: [{ type: 'string' }, { type: 'string' }], type: 'array' },
                $eq: { type: 'string' },
                $gt: { type: 'string' },
                $gte: { type: 'string' },
                $ilike: { type: 'string' },
                $in: { items: { type: 'string' }, type: 'array' },
                $like: { type: 'string' },
                $lt: { type: 'string' },
                $lte: { type: 'string' },
                $nbetween: { items: [{ type: 'string' }, { type: 'string' }], type: 'array' },
                $neq: { type: 'string' },
                $nilike: { type: 'string' },
                $nin: { items: { type: 'string' }, type: 'array' },
                $nlike: { type: 'string' },
                $nregex: { type: 'string' },
                $regex: { type: 'string' },
              },
              type: ['string', 'number', 'object'],
            },
            sub: {
              properties: {
                $between: { items: [{ type: ['number', 'string'] }, { type: ['number', 'string'] }], type: 'array' },
                $eq: { type: ['number', 'string'] },
                $gt: { type: ['number', 'string'] },
                $gte: { type: ['number', 'string'] },
                $ilike: { type: 'string' },
                $in: { items: { type: ['number', 'string'] }, type: 'array' },
                $like: { type: 'string' },
                $lt: { type: ['number', 'string'] },
                $lte: { type: ['number', 'string'] },
                $nbetween: { items: [{ type: ['number', 'string'] }, { type: ['number', 'string'] }], type: 'array' },
                $neq: { type: ['number', 'string'] },
                $nilike: { type: 'string' },
                $nin: { items: { type: ['number', 'string'] }, type: 'array' },
                $nlike: { type: 'string' },
                $nregex: { type: 'string' },
                $regex: { type: 'string' },
              },
              type: ['string', 'number', 'object'],
            },
          },
          type: 'object',
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
    expect(response.json()).toEqual(<EntityImpl[]>[{ field: 'parent', sub: { field: 'joined' } }]);
  });
});
