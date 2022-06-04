import { FastifyInstance } from 'fastify';
import { Constructable } from '../interfaces/constructable.js';
import type { CREATOR } from '../symbols/index.js';

export { CREATOR } from '../symbols/index.js';
export interface Registrable<T = any> extends Constructable<T> {
  [CREATOR]: {
    register(instance?: FastifyInstance, prefix?: string): Promise<void>;
  };
}
