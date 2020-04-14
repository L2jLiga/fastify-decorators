import { FastifyInstance } from 'fastify';
import { CREATOR, INJECTABLES } from '../symbols';

export interface InjectableClass {
    [CREATOR]?: {
        register: (instance: FastifyInstance) => void
    }
    [INJECTABLES]: Map<any, any>;
}
