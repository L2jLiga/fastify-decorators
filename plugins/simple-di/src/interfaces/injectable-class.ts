import { ClassLoader, Constructable, CREATOR, Scope } from 'fastify-decorators/plugins';
import { DESTRUCTOR, INITIALIZER } from '../symbols.js';

export interface InjectableService<T = unknown> extends Constructable<T> {
  [CREATOR]: {
    register<Type>(classLoader: ClassLoader, scope: Scope): Type;
  };

  [INITIALIZER]?<Type>(self: Type): void;

  [DESTRUCTOR]?: string | symbol;
}
