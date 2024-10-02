import { FastifyInstance } from 'fastify';
import { REGISTRABLE } from '../constants/symbols.js';

export interface Registrable {
  [REGISTRABLE]: (instance: FastifyInstance) => Promise<unknown>;
}
