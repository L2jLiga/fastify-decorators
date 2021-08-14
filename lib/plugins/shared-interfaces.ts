import { FastifyInstance } from 'fastify';
import type { CREATOR } from '../symbols/index.js';

export { CREATOR } from '../symbols/index.js';
export interface Registrable {
  [CREATOR]: {
    register(instance?: FastifyInstance, prefix?: string): Promise<void>;
  };

  new (): any;

  new (...args: unknown[]): any;
}
