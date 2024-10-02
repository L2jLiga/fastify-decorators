import { ClassLoader, REGISTRABLE, Scope } from 'fastify-decorators/plugins';
import { InjectableService } from '../interfaces/injectable-class.js';
import { _injectablesHolder } from '../registry/_injectables-holder.js';
import { DESTRUCTOR, INITIALIZER } from '../symbols.js';
import { dependencyScopeManager } from '../utils/dependencies-scope-manager.js';
import { FastifyInstance } from 'fastify';

const INITIALIZED = Symbol.for('fastify-decorators.initializer-called');

/**
 * Decorator for making classes injectable
 */
export function Service(): ClassDecorator;
export function Service(injectableToken: string | symbol): ClassDecorator;
export function Service(injectableToken?: string | symbol): unknown {
  return (target: InjectableService) => {
    target[REGISTRABLE] = (classLoader: ClassLoader, scope: Scope): object => {
      if ('context' in scope) scope = scope.server as FastifyInstance;
      const instance = classLoader(target, scope) as {
        [INITIALIZED]?: Promise<unknown>;
        [INITIALIZER]?(instance: FastifyInstance): Promise<unknown>;
        [DESTRUCTOR]?(): void;
      };
      if (instance[INITIALIZED]) return instance as object;

      instance[INITIALIZED] = Promise.resolve(target[INITIALIZER]?.(instance));
      if (target[DESTRUCTOR]) dependencyScopeManager.registerDestructor(scope, () => instance[target[DESTRUCTOR] as typeof DESTRUCTOR]?.());

      return instance as object;
    };

    _injectablesHolder.injectService(target, target, false);
    if (injectableToken) _injectablesHolder.injectService(injectableToken, target, false);
  };
}
