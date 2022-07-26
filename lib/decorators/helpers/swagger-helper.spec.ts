import { FastifyInstance } from 'fastify';
import { injectTagsIntoSwagger, TagObject } from './swagger-helper.js';

describe('Decorators / helpers / Swagger helper', () => {
  it('should inject tags into swagger object when it contains tags object', () =>
    new Promise<void>((resolve, reject) => {
      const swaggerDefinition = { tags: [{ name: 'Test' }] } as { tags?: TagObject[] };
      const instance = {
        async addHook(hookName: string, Fn: () => Promise<void> | void) {
          if (hookName !== 'onReady') reject('Expect onReady hook to be added');
          await Fn();

          expect(swaggerDefinition.tags).toEqual([{ name: 'Test' }, { name: 'User', description: 'User description' }]);

          resolve();
        },
        swagger: () => swaggerDefinition,
      } as unknown as FastifyInstance;

      injectTagsIntoSwagger(instance, [{ name: 'User', description: 'User description' }]);
    }));

  it('should create tags object and inject tags into swagger object when it does not contains tags object', () =>
    new Promise<void>((resolve, reject) => {
      const swaggerDefinition = {} as { tags?: TagObject[] };
      const instance = {
        async addHook(hookName: string, Fn: () => Promise<void> | void) {
          if (hookName !== 'onReady') reject('Expect onReady hook to be added');
          await Fn();

          expect(swaggerDefinition.tags).toEqual([{ name: 'User', description: 'User description' }]);

          resolve();
        },
        swagger: () => swaggerDefinition,
      } as unknown as FastifyInstance;

      injectTagsIntoSwagger(instance, [{ name: 'User', description: 'User description' }]);
    }));

  it('should inject tags into oas object when it contains tags object', () =>
    new Promise<void>((resolve, reject) => {
      const swaggerDefinition = { tags: [{ name: 'Test' }] } as { tags?: TagObject[] };
      const instance = {
        async addHook(hookName: string, Fn: () => Promise<void> | void) {
          if (hookName !== 'onReady') reject('Expect onReady hook to be added');
          await Fn();

          expect(swaggerDefinition.tags).toEqual([{ name: 'Test' }, { name: 'User', description: 'User description' }]);

          resolve();
        },
        oas: () => swaggerDefinition,
      } as unknown as FastifyInstance;

      injectTagsIntoSwagger(instance, [{ name: 'User', description: 'User description' }]);
    }));

  it('should create tags object and inject tags into oas object when it does not contains tags object', () =>
    new Promise<void>((resolve, reject) => {
      const swaggerDefinition = {} as { tags?: TagObject[] };
      const instance = {
        async addHook(hookName: string, Fn: () => Promise<void> | void) {
          if (hookName !== 'onReady') reject('Expect onReady hook to be added');
          await Fn();

          expect(swaggerDefinition.tags).toEqual([{ name: 'User', description: 'User description' }]);

          resolve();
        },
        oas: () => swaggerDefinition,
      } as unknown as FastifyInstance;

      injectTagsIntoSwagger(instance, [{ name: 'User', description: 'User description' }]);
    }));

  it('should inject tags into openapiDocument object when it contains tags object', () =>
    new Promise<void>((resolve, reject) => {
      const swaggerDefinition = { tags: [{ name: 'Test' }] } as { tags?: TagObject[] };
      const instance = {
        async addHook(hookName: string, Fn: () => Promise<void> | void) {
          if (hookName !== 'onReady') reject('Expect onReady hook to be added');
          await Fn();

          expect(swaggerDefinition.tags).toEqual([{ name: 'Test' }, { name: 'User', description: 'User description' }]);

          resolve();
        },
        openapiDocument: swaggerDefinition,
      } as unknown as FastifyInstance;

      injectTagsIntoSwagger(instance, [{ name: 'User', description: 'User description' }]);
    }));

  it('should create tags object and inject tags into openapiDocument object when it does not contains tags object', () =>
    new Promise<void>((resolve, reject) => {
      const swaggerDefinition = {} as { tags?: TagObject[] };
      const instance = {
        async addHook(hookName: string, Fn: () => Promise<void> | void) {
          if (hookName !== 'onReady') reject('Expect onReady hook to be added');
          await Fn();

          expect(swaggerDefinition.tags).toEqual([{ name: 'User', description: 'User description' }]);

          resolve();
        },
        openapiDocument: swaggerDefinition,
      } as unknown as FastifyInstance;

      injectTagsIntoSwagger(instance, [{ name: 'User', description: 'User description' }]);
    }));
});
