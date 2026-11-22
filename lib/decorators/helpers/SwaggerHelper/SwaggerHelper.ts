import {FastifyInstance} from "fastify";


/**
 * Adds tags into fastify Swagger/OpenAPI specification when application is ready to start
 * @param fastify of application
 * @param tags to add to OpenAPI/Swagger doc
 */
export const injectTags=(fastify:FastifyInstance,tags:TagObject[]):void=>{
    if(tags.length>0) fastify.addHook("onReady", async () => {
        const swaggerConfig = getConfig(fastify);
        if (!swaggerConfig) return;
        swaggerConfig.tags = swaggerConfig.tags || [];
        swaggerConfig.tags.push(...tags);
    });
}

const getConfig=(fastify:FastifyInstance):({ tags?: TagObject[] }|undefined)=>{
    if ("swagger" in fastify) return (fastify as unknown as { swagger(): { tags?: TagObject[] } }).swagger();
    if ("oas" in fastify) return (fastify as unknown as { oas(): { tags?: TagObject[] } }).oas();
    if ("openapiDocument" in fastify) return (fastify as unknown as { openapiDocument: { tags?: TagObject[] } }).openapiDocument;
}

export interface ExternalDocumentationObject {
    description?: string;
    url: string;
}
export interface TagObject {
    name: string;
    description?: string;
    externalDocs?: ExternalDocumentationObject;
}
