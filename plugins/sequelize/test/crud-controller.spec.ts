import fastify from 'fastify';
import { DataTypes, Model, Sequelize } from 'sequelize';
import { CrudController } from '../src/controllers/crud-controller';

describe('Decorators: CrudController', () => {
  let sequelize: Sequelize;

  class User extends Model {
    public id!: number; // Note that the `null assertion` `!` is required in strict mode.
    public name!: string;
    public preferredName!: string | null; // for nullable fields
  }

  beforeEach(async () => {
    sequelize = new Sequelize('sqlite:memory.db:', { logging: false });
    await sequelize.authenticate();
    User.init<User>(
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: new DataTypes.STRING(128), allowNull: false },
        preferredName: { type: new DataTypes.STRING(128), allowNull: true },
      },
      { tableName: 'users', sequelize },
    );
    await User.sync({ force: true });
  });
  afterEach(async () => {
    await sequelize.drop();
    await sequelize.close();
  });

  it(`should register schemas for controller entity and all related entities`, async () => {
    @CrudController(User, '/')
    class Ctrl {}

    const app = fastify();
    app.decorate('sequelize', sequelize);

    // @ts-expect-error implicitly created property
    Ctrl[Symbol.for('fastify-decorators.creator')].register(app, new Map(), true);

    const schemas = app.getSchemas();

    expect(schemas['/models/users']).toEqual({
      $id: '/models/users',
      $schema: 'http://json-schema.org/schema#',
      definitions: {
        entity: {
          type: 'object',
          properties: {
            createdAt: { type: 'string', format: 'date-time', nullable: false, _options: { generated: false } },
            id: { type: 'integer', nullable: false, _options: { generated: true } },
            name: { type: 'string', nullable: false, _options: { generated: false } },
            preferredName: { type: 'string', nullable: true, _options: { generated: false } },
            updatedAt: { type: 'string', format: 'date-time', nullable: false, _options: { generated: false } },
          },
        },
      },
    });

    const response = await app.inject('/');

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual([]);
  });

  it('should reply with data', async () => {
    @CrudController(User, '/')
    class Ctrl {}

    const app = fastify();
    app.decorate('sequelize', sequelize);
    const user = (await User.create({ name: 'UserName' })) as User & { createdAt: Date; updatedAt: Date };

    // @ts-expect-error implicitly created property
    Ctrl[Symbol.for('fastify-decorators.creator')].register(app, new Map(), true);

    const response = await app.inject('/');

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual([
      {
        id: user.id,
        name: user.name,
        preferredName: null,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
    ]);
  });
});
