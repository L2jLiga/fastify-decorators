import { ClassLoader, REGISTRABLE, Scope } from 'fastify-decorators/plugins';
import 'reflect-metadata';
import { InjectableService } from '../../interfaces/injectable-class.js';
import { _InjectablesHolder } from '../../registry/_injectables-holder.js';
import { SERVICE_INJECTION } from '../../symbols.js';
import { dependencyScopeManager } from '../../utils/dependencies-scope-manager.js';
import { hasServiceInjection } from './ensure-service-injection.js';

export interface ServiceInjection {
  name: string | symbol | unknown;
  propertyKey: string | symbol;
}

export function classLoaderFactory(injectables: _InjectablesHolder): ClassLoader {
  return function classLoader(Constructable: object, scope: Scope): object {
    if (dependencyScopeManager.hasInstance(scope, Constructable)) return dependencyScopeManager.getInstance(scope, Constructable) as object;
    const target = Constructable as { new (): object };

    /**
     * Step 1: Patch constructor and prototype with Injectables (issue #752)
     */
    injectProperties(target, target, injectables, classLoader, scope, target.name);
    injectProperties(target.prototype, target.prototype, injectables, classLoader, scope, target.name);

    /**
     * Step 2: Create instance
     */
    const instance = Reflect.construct(target, getArguments(target, injectables, classLoader, scope, target.name));

    /**
     * Step 3: Inject dependencies into instance (issue #750)
     */
    injectProperties(instance, target.prototype, injectables, classLoader, scope, target.name);

    dependencyScopeManager.registerInstance(scope, Constructable, instance);

    return instance;
  };
}

function injectProperties(target: unknown, source: unknown, injectables: _InjectablesHolder, classLoader: ClassLoader, scope: Scope, className: string) {
  if (!hasServiceInjection(source)) return;
  const viaInject = source[SERVICE_INJECTION];
  for (const { name, propertyKey } of viaInject) {
    if (!injectables.has(name))
      throw new TypeError(`Invalid argument provided for "${className}.${String(propertyKey)}". Expected class annotated with @Service.`);

    Object.defineProperty(target, propertyKey, {
      value: (injectables.get(name) as InjectableService)[REGISTRABLE](classLoader, scope),
      enumerable: true,
      configurable: true,
      writable: true,
    });
  }
}

function getArguments(constructor: { new (): object }, injectables: _InjectablesHolder, classLoader: ClassLoader, scope: Scope, className: string): unknown[] {
  const metadata: unknown[] = Reflect.getMetadata('design:paramtypes', constructor) || [];
  return metadata
    .map((value) => injectables.get(value))
    .map((value: InjectableService | undefined) => {
      if (value) return value[REGISTRABLE](classLoader, scope);
      throw new TypeError(`Invalid argument provided in ${className}'s constructor. Expected class annotated with @Service.`);
    });
}
