/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

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

export function createWithInjectedDependencies<C>(constructor: Constructor<C>, injectables: Injectables, cacheResult: boolean): C {
  /**
   * Step 1: Patch constructor and prototype with Injectables (issue #752)
   */
  injectProperties(constructor, injectables, cacheResult, constructor.name);
  injectProperties(constructor.prototype, injectables, cacheResult, constructor.name);

  /**
   * Step 2: Create instance
   */
  const instance =
    typeof Reflect.getMetadata === 'function' ? new constructor(...getArguments(constructor, injectables, cacheResult, constructor.name)) : new constructor();

  /**
   * Step 3: Return instance with dependencies injected
   */
  return instance;
}

function injectProperties(target: unknown, injectables: Injectables, cacheResult: boolean, className: string) {
  if (!hasServiceInjection(target)) return;
  const viaInject = target[SERVICE_INJECTION];
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
  const metadata = Reflect.getMetadata('design:paramtypes', constructor) || [];
  return metadata
    .map((value) => injectables.get(value))
    .map((value: InjectableService | undefined) => {
      if (value) return value[CREATOR].register(injectables, cacheResult);
      throw new TypeError(`Invalid argument provided in ${className}'s constructor. Expected class annotated with @Service.`);
    });
}
