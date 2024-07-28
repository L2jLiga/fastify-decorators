import { Constructable } from 'fastify-decorators/plugins';

export interface ServiceMock<T = unknown> {
  provide: string | symbol | Record<string | symbol | number, unknown> | Constructable<T>;
  useValue: Record<string | symbol | number, unknown>;
}
