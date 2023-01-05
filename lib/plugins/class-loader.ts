import { FastifyInstance, FastifyRequest } from 'fastify';
import { Constructable } from './shared-interfaces.js';

declare module 'fastify' {
  interface FastifyInstance {
    [CLASS_LOADER]: ClassLoader;
  }
}

export const CLASS_LOADER = Symbol.for('fastify-decorators.class-loader');

export type Scope = FastifyInstance | FastifyRequest;

export type ClassLoader = <C>(constructor: Constructable<C>, scope: Scope) => C;
