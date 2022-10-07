/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { CREATOR } from 'fastify-decorators/plugins';
import { Injectables, InjectableService } from '../../interfaces/injectable-class.js';
import { SERVICE_INJECTION } from '../../symbols.js';

import { hasServiceInjection } from './ensure-service-injection.js';

export type Constructor<T> = { new (): T } | { new (...args: any): T };

export interface ServiceInjection {
  name: string | symbol | unknown;
  propertyKey: string | symbol;
}

export function createWithInjectedDependencies<C>(Constructable: Constructor<C>, injectables: Injectables, cacheResult: boolean): C {
  /**
   * Step 1: Patch constructor and prototype with Injectables (issue #752)
   */
  injectProperties(Constructable, Constructable, injectables, cacheResult, Constructable.name);
  injectProperties(Constructable.prototype, Constructable.prototype, injectables, cacheResult, Constructable.name);

  /**
   * Step 2: Create instance
   */
  const instance = new Constructable(...getArguments(Constructable, injectables, cacheResult, Constructable.name));

  /**
   * Step 3: Inject dependencies into instance (issue #750)
   */
  injectProperties(instance, Constructable.prototype, injectables, cacheResult, Constructable.name);

  /**
   * Step 4: Return instance with dependencies injected
   */
  return instance;
}

function injectProperties(target: unknown, source: unknown, injectables: Injectables, cacheResult: boolean, className: string) {
  if (!hasServiceInjection(source)) return;
  const viaInject = source[SERVICE_INJECTION];
  for (const { name, propertyKey } of viaInject) {
    if (!injectables.has(name))
      throw new TypeError(`Invalid argument provided for "${className}.${String(propertyKey)}". Expected class annotated with @Service.`);

    Object.defineProperty(target, propertyKey, {
      // @ts-expect-error checked above
      value: injectables.get(name)[CREATOR].register(injectables, cacheResult),
      enumerable: true,
      configurable: true,
    });
  }
}

function getArguments<C>(constructor: Constructor<C>, injectables: Injectables, cacheResult: boolean, className: string) {
  const metadata: unknown[] = Reflect.getMetadata('design:paramtypes', constructor) || [];
  return metadata
    .map((value) => injectables.get(value))
    .map((value: InjectableService | undefined) => {
      if (value) return value[CREATOR].register(injectables, cacheResult);
      throw new TypeError(`Invalid argument provided in ${className}'s constructor. Expected class annotated with @Service.`);
    });
}
