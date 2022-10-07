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
  if (tags.length === 0) return;
  instance.addHook('onReady', async () => {
    const swaggerConfig = getSwaggerConfig(instance);
    if (!swaggerConfig) return;
    swaggerConfig.tags = swaggerConfig.tags || [];
    swaggerConfig.tags.push(...tags);
  });
}

function getSwaggerConfig(instance: FastifyInstance): { tags?: TagObject[] } | undefined {
  if ('swagger' in instance) return (instance as unknown as { swagger(): { tags?: TagObject[] } }).swagger();
  if ('oas' in instance) return (instance as unknown as { oas(): { tags?: TagObject[] } }).oas();
  if ('openapiDocument' in instance) return (instance as unknown as { openapiDocument: { tags?: TagObject[] } }).openapiDocument;
}
