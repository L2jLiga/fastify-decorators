import { FastifyInstance } from 'fastify';
import type { CREATOR } from '../symbols/index.js';

export { CREATOR } from '../symbols/index.js';

// TODO: Check for better solution
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructable<T = unknown> = new (...args: any) => T;

export interface Registrable<T = unknown> extends Constructable<T> {
  [CREATOR]: {
    register(instance: FastifyInstance, prefix?: string): Promise<void> | void;
  };
}
