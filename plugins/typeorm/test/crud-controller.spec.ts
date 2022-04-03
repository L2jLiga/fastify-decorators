import fastify from 'fastify';
import * as fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { DataSource, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { CrudController } from '../src/index.js';

const DATABASE_FILE = new URL('database.db', import.meta.url);

describe('Decorators: CrudController', () => {
  let dataSource: DataSource;

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
    if (fs.existsSync(DATABASE_FILE)) fs.unlinkSync(DATABASE_FILE);
    dataSource = await new DataSource({
      type: 'sqljs',
      autoSave: true,
      location: fileURLToPath(DATABASE_FILE),
      entities: [EntityImpl, EntitySubImpl],
      logging: false,
      synchronize: true,
    }).initialize();
  });
  afterEach(async () => {
    await dataSource.dropDatabase();
    await dataSource.destroy();
  });

  it(`should register schemas for controller entity and all related entities`, async () => {
    @CrudController(EntityImpl, '/')
    class Ctrl {}

    const app = fastify();
    app.decorate('dataSource', dataSource);

    // @ts-expect-error implicitly created property
    Ctrl[Symbol.for('fastify-decorators.creator')].register(app, '', new Map(), true);

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
            },
          },
        },
        query: {
          properties: {
            $or: { items: { $ref: '#/definitions/query' }, type: 'array' },
            field: {
              oneOf: [
                { type: 'string' },
                { type: 'number' },
                {
                  type: 'object',
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
                },
              ],
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
            },
            sub: { oneOf: [{ $ref: '/models/EntitySubImpl#/definitions/entity' }, { type: 'null' }] },
          },
        },
        query: {
          properties: {
            $or: { items: { $ref: '#/definitions/query' }, type: 'array' },
            field: {
              oneOf: [
                { type: 'string' },
                { type: 'number' },
                {
                  type: 'object',
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
                },
              ],
            },
            sub: {
              oneOf: [
                { type: 'string' },
                { type: 'number' },
                {
                  type: 'object',
                  properties: {
                    $between: {
                      items: [{ anyOf: [{ type: 'number' }, { type: 'string' }] }, { anyOf: [{ type: 'number' }, { type: 'string' }] }],
                      type: 'array',
                    },
                    $eq: { anyOf: [{ type: 'number' }, { type: 'string' }] },
                    $gt: { anyOf: [{ type: 'number' }, { type: 'string' }] },
                    $gte: { anyOf: [{ type: 'number' }, { type: 'string' }] },
                    $ilike: { type: 'string' },
                    $in: { items: { anyOf: [{ type: 'number' }, { type: 'string' }] }, type: 'array' },
                    $like: { type: 'string' },
                    $lt: { anyOf: [{ type: 'number' }, { type: 'string' }] },
                    $lte: { anyOf: [{ type: 'number' }, { type: 'string' }] },
                    $nbetween: {
                      items: [{ anyOf: [{ type: 'number' }, { type: 'string' }] }, { anyOf: [{ type: 'number' }, { type: 'string' }] }],
                      type: 'array',
                    },
                    $neq: { anyOf: [{ type: 'number' }, { type: 'string' }] },
                    $nilike: { type: 'string' },
                    $nin: { items: { anyOf: [{ type: 'number' }, { type: 'string' }] }, type: 'array' },
                    $nlike: { type: 'string' },
                    $nregex: { type: 'string' },
                    $regex: { type: 'string' },
                  },
                },
              ],
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
    app.decorate('dataSource', dataSource);

    // @ts-expect-error implicitly created property
    Ctrl[Symbol.for('fastify-decorators.creator')].register(app, '', new Map(), true);

    await dataSource.manager.save([entitySub, entity]);

    const response = await app.inject('/');

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(<EntityImpl[]>[{ field: 'parent', sub: { field: 'joined' } }]);
  });
});
