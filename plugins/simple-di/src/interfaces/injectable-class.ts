import { ClassLoader, REGISTRABLE, Scope } from 'fastify-decorators/plugins';
import { DESTRUCTOR, INITIALIZER } from '../symbols.js';

export interface InjectableService {
  [REGISTRABLE]: (classLoader: ClassLoader, scope: Scope) => object;

  [INITIALIZER]?<Type>(self: Type): void;

  [DESTRUCTOR]?: string | symbol;
}
