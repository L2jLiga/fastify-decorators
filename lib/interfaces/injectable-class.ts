import { FastifyInstance } from 'fastify';
import { CREATOR } from '../symbols';

export interface InjectableClass {
    [CREATOR]: {
        register: (instance: FastifyInstance) => void
    }
}
