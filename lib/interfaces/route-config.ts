import type { RouteShorthandOptions } from 'fastify';

/**
 * Common config for all route handlers
 */
export interface RouteConfig {
  /**
   * Route url which will be passed to Fastify
   */
  url: string;

  /**
   * Route options which will be passed to Fastify
   */
  options?: RouteShorthandOptions;
}
