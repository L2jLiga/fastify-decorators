/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { ClassLoader } from '../../interfaces/bootstrap-config.js';
import { Injectables, InjectableService } from '../../interfaces/injectable-class.js';
import { CREATOR, SERVICE_INJECTION } from '../../symbols/index.js';
import { hasServiceInjection } from './class-properties.js';

export type Constructor<T> = { new (): T } | { new (...args: any): T };

export interface ServiceInjection {
  name: string | symbol | unknown;
  propertyKey: string | symbol;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Reflect {
  function getMetadata(metadataKey: 'design:paramtypes', target: unknown): ServiceInjection['name'][] | undefined;
}

const instances = new Map<Constructor<unknown>, unknown>();
export function classLoaderFactory(injectables: Injectables, cacheResult: boolean): ClassLoader {
  return function createWithInjectedDependencies<C>(constructor: Constructor<C>, useCached = cacheResult): C {
    if (useCached && instances.has(constructor)) return instances.get(constructor) as C;

    /**
     * Step 1: Patch constructor and prototype with Injectables (issue #752)
     */
    injectProperties(constructor, constructor, injectables, createWithInjectedDependencies, constructor.name);
    injectProperties(constructor.prototype, constructor.prototype, injectables, createWithInjectedDependencies, constructor.name);

    /**
     * Step 2: Create instance
     */
    const instance =
      typeof Reflect.getMetadata === 'function'
        ? new constructor(...getArguments(constructor, injectables, createWithInjectedDependencies, constructor.name))
        : new constructor();

    /**
     * Step 3: Inject dependencies into instance (issue #750)
     */
    injectProperties(instance, constructor.prototype, injectables, createWithInjectedDependencies, constructor.name);

    /**
     * Step 4: Optionally store instance in Map if cache enabled
     */
    if (useCached && !instances.has(constructor)) instances.set(constructor, instance);

    /**
     * Step 4: Return instance with dependencies injected
     */
    return instance;
  };
}

function injectProperties(target: unknown, source: unknown, injectables: Injectables, classLoader: ClassLoader, className: string) {
  if (!hasServiceInjection(source)) return;
  const viaInject = source[SERVICE_INJECTION];
  for (const { name, propertyKey } of viaInject) {
    if (!injectables.has(name))
      throw new TypeError(`Invalid argument provided for "${className}.${String(propertyKey)}". Expected class annotated with @Service.`);

    Object.defineProperty(target, propertyKey, {
      // @ts-expect-error we already have checked that injectables list has this entry, no needs to nullish coalescing and so on
      value: injectables.get(name)[CREATOR].register(classLoader),
      enumerable: true,
      configurable: true,
    });
  }
}

function getArguments<C>(constructor: Constructor<C>, injectables: Injectables, classLoader: ClassLoader, className: string) {
  const metadata = Reflect.getMetadata('design:paramtypes', constructor) || [];
  return metadata
    .map((value) => injectables.get(value))
    .map((value: InjectableService | undefined) => {
      if (value) return value[CREATOR].register(classLoader);
      throw new TypeError(`Invalid argument provided in ${className}'s constructor. Expected class annotated with @Service.`);
    });
}
