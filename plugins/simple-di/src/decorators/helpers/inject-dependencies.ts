/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */
import { ClassLoader, Constructable, CREATOR, Scope } from 'fastify-decorators/plugins';
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
  function classLoader<C>(Constructable: Constructable<C>, scope: Scope) {
    if (dependencyScopeManager.has(scope, Constructable)) return dependencyScopeManager.get(scope, Constructable) as C;

    /**
     * Step 1: Patch constructor and prototype with Injectables (issue #752)
     */
    injectProperties(Constructable, Constructable, injectables, classLoader, Constructable.name);
    injectProperties(Constructable.prototype, Constructable.prototype, injectables, classLoader, Constructable.name);

    /**
     * Step 2: Create instance
     */
    const instance = Reflect.construct(Constructable, getArguments(Constructable, injectables, classLoader, Constructable.name)) as C;

    /**
     * Step 3: Inject dependencies into instance (issue #750)
     */
    injectProperties(instance, Constructable.prototype, injectables, classLoader, Constructable.name);

    dependencyScopeManager.add(scope, Constructable, instance);

    return instance as C;
  }

  return Object.assign(classLoader, {
    reset(scope: Scope) {
      dependencyScopeManager.clear(scope);
    },
  });
}

function injectProperties(target: unknown, source: unknown, injectables: _InjectablesHolder, classLoader: ClassLoader, className: string) {
  if (!hasServiceInjection(source)) return;
  const viaInject = source[SERVICE_INJECTION];
  for (const { name, propertyKey } of viaInject) {
    if (!injectables.has(name))
      throw new TypeError(`Invalid argument provided for "${className}.${String(propertyKey)}". Expected class annotated with @Service.`);

    Object.defineProperty(target, propertyKey, {
      value: (injectables.get(name) as InjectableService)[CREATOR].register(classLoader),
      enumerable: true,
      configurable: true,
      writable: true,
    });
  }
}

function getArguments<C>(constructor: Constructable<C>, injectables: _InjectablesHolder, classLoader: ClassLoader, className: string): unknown[] {
  const metadata: unknown[] = Reflect.getMetadata('design:paramtypes', constructor) || [];
  return metadata
    .map((value) => injectables.get(value))
    .map((value: InjectableService | undefined) => {
      if (value) return value[CREATOR].register(classLoader);
      throw new TypeError(`Invalid argument provided in ${className}'s constructor. Expected class annotated with @Service.`);
    });
}
