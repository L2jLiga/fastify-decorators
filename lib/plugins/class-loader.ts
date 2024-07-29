import { FastifyInstance, FastifyRequest } from 'fastify';
import { Constructable } from './shared-interfaces.js';

declare module 'fastify' {
  interface FastifyInstance {
    [CLASS_LOADER]: ClassLoader;
  }
}

/**
 * Symbol for getting class-loader from
 * FastifyInstance.
 */
export const CLASS_LOADER = Symbol.for('fastify-decorators.class-loader');

/**
 * Dependency scope, used to determine in
 * which context class isntance was requested.
 * By default all class instances are requested
 * in FastifyInstance context and thus they
 * are singletons, with one exception - when using
 * per-request controller strategy.
 */
export type Scope = FastifyInstance | FastifyRequest;

/**
 * ClassLoader is the function which fastify-decorators
 * uses under the hood to get class instance for given
 * scope.
 * Currently only 2 scopes are supported:
 * - FastifyInstance - classes instantiated in this
 *   scope are singletons
 * - FastifyRequest - classes instantiated in this
 *   scope destroyed when request finished
 */
export type ClassLoader = <C>(constructor: Constructable<C>, scope: Scope) => C;
