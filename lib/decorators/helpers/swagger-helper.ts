/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

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
 * @param fastifyInstance of application
 * @param tags to add to OpenAPI/Swagger doc
 */
export function injectTagsIntoSwagger(fastifyInstance: FastifyInstance, tags: TagObject[]): void {
  if (tags.length === 0) return;
  fastifyInstance.addHook('onReady', async () => {
    const swaggerConfig = getSwaggerConfig(fastifyInstance);
    if (!swaggerConfig) return;
    swaggerConfig.tags = swaggerConfig.tags || [];
    swaggerConfig.tags.push(...tags);
  });
}

function getSwaggerConfig(fastifyInstance: FastifyInstance): { tags?: TagObject[] } | undefined {
  if ('swagger' in fastifyInstance) return (fastifyInstance as unknown as { swagger(): { tags?: TagObject[] } }).swagger();
  if ('oas' in fastifyInstance) return (fastifyInstance as unknown as { oas(): { tags?: TagObject[] } }).oas();
  if ('openapiDocument' in fastifyInstance) return (fastifyInstance as unknown as { openapiDocument: { tags?: TagObject[] } }).openapiDocument;
}
