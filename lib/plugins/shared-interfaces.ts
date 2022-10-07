import { FastifyInstance } from 'fastify';
import type { CREATOR } from '../symbols/index.js';

export { CREATOR } from '../symbols/index.js';

export interface Constructable<T> {
  new (...args: any): T;
}

export interface Registrable<T = any> extends Constructable<T> {
  [CREATOR]: {
    register(instance?: FastifyInstance, prefix?: string): Promise<void>;
  };
}
