/**
 * Controller/RequestHandler constructor key
 */
export const REGISTRABLE: unique symbol = Symbol.for('fastify-decorators.registrable');

/**
 * Request handlers container key
 */
export const REQUEST_HANDLER: unique symbol = Symbol.for('fastify-decorators.request-handler');

/**
 * Hooks container key
 */
export const HOOK: unique symbol = Symbol.for('fastify-decorators.hook');

/**
 * Error handler container key
 */
export const ERROR_HANDLER: unique symbol = Symbol.for('fastify-decorators.error-handler');
