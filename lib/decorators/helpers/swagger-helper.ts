import { FastifyInstance } from 'fastify';

export interface ExternalDocumentationObject {
  description?: string;
  url: string;
}
export interface TagObject {
  name: string;
  description?: string;
  externalDocs?: ExternalDocumentationObject;
}

/**
 * Adds tags into fastify Swagger/OpenAPI specification when application is ready to start
 * @param instance of application
 * @param tags to add to OpenAPI/Swagger doc
 */
export function injectTagsIntoSwagger(instance: FastifyInstance, tags: TagObject[]): void {
  instance.addHook('onReady', async () => {
    // fastify-swagger and @fastify/swagger
    if ('swagger' in instance) {
      const swagger = (instance as unknown as { swagger: any }).swagger();
      swagger.tags = swagger.tags || [];
      swagger.tags.push(...tags);
    }

    // fastify-oas
    if ('oas' in instance) {
      const swagger = (instance as any).oas();
      swagger.tags = swagger.tags || [];
      swagger.tags.push(...tags);
    }

    // @eropple/fastify-openapi3
    if ('openapiDocument' in instance) {
      const openapiDocument = (instance as any).openapiDocument;
      openapiDocument.tags = openapiDocument.tags || [];
      openapiDocument.tags.push(...tags);
    }
  });
}
