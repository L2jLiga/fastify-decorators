import { FastifyInstance } from 'fastify';
import { injectTagsIntoSwagger, TagObject } from './swagger-helper.js';

describe('Decorators / helpers / Swagger helper', () => {
  const callInjection = (swaggerDefinitionProvider: Record<string, unknown>, tags: TagObject[]) =>
    new Promise<void>((resolve, reject) => {
      const instance = {
        async addHook(hookName: string, Fn: () => Promise<void> | void) {
          if (hookName !== 'onReady') reject('Expect onReady hook to be added');
          await Fn();

          resolve();
        },
        ...swaggerDefinitionProvider,
      } as unknown as FastifyInstance;

      injectTagsIntoSwagger(instance, tags);
    });

  it('should inject tags into swagger object when it contains tags object', async () => {
    const swaggerDefinition = { tags: [{ name: 'Test' }] } as { tags?: TagObject[] };

    await callInjection({ swagger: () => swaggerDefinition }, [{ name: 'User', description: 'User description' }]);

    expect(swaggerDefinition.tags).toEqual([{ name: 'Test' }, { name: 'User', description: 'User description' }]);
  });

  it('should create tags object and inject tags into swagger object when it does not contains tags object', async () => {
    const swaggerDefinition = {} as { tags?: TagObject[] };

    await callInjection({ swagger: () => swaggerDefinition }, [{ name: 'User', description: 'User description' }]);

    expect(swaggerDefinition.tags).toEqual([{ name: 'User', description: 'User description' }]);
  });

  it('should inject tags into oas object when it contains tags object', async () => {
    const swaggerDefinition = { tags: [{ name: 'Test' }] } as { tags?: TagObject[] };

    await callInjection({ oas: () => swaggerDefinition }, [{ name: 'User', description: 'User description' }]);

    expect(swaggerDefinition.tags).toEqual([{ name: 'Test' }, { name: 'User', description: 'User description' }]);
  });

  it('should create tags object and inject tags into oas object when it does not contains tags object', async () => {
    const swaggerDefinition = {} as { tags?: TagObject[] };

    await callInjection({ oas: () => swaggerDefinition }, [{ name: 'User', description: 'User description' }]);

    expect(swaggerDefinition.tags).toEqual([{ name: 'User', description: 'User description' }]);
  });

  it('should inject tags into openapiDocument object when it contains tags object', async () => {
    const swaggerDefinition = { tags: [{ name: 'Test' }] } as { tags?: TagObject[] };

    await callInjection({ openapiDocument: swaggerDefinition }, [{ name: 'User', description: 'User description' }]);

    expect(swaggerDefinition.tags).toEqual([{ name: 'Test' }, { name: 'User', description: 'User description' }]);
  });

  it('should create tags object and inject tags into openapiDocument object when it does not contains tags object', async () => {
    const swaggerDefinition = {} as { tags?: TagObject[] };

    await callInjection({ openapiDocument: swaggerDefinition }, [{ name: 'User', description: 'User description' }]);

    expect(swaggerDefinition.tags).toEqual([{ name: 'User', description: 'User description' }]);
  });

  it('should do nothing when swagger configuration not found', async () => {
    await new Promise<void>((resolve, reject) => {
      const instance = {
        async addHook(hookName: string, Fn: () => Promise<void> | void) {
          if (hookName !== 'onReady') reject('Expect onReady hook to be added');
          await Fn();

          resolve();
        },
      } as unknown as FastifyInstance;

      injectTagsIntoSwagger(instance, [{ name: 'User', description: 'User description' }]);

      expect(Object.keys(instance)).toEqual(['addHook']);
    });
  });

  it('should not add hook when tags are empty', () => {
    const addHook = jest.fn();
    const instance = { addHook } as unknown as FastifyInstance;

    injectTagsIntoSwagger(instance, []);

    expect(addHook).not.toHaveBeenCalled();
  });
});
