/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { Constructable, CREATOR } from 'fastify-decorators/plugins';
import { Injectables, InjectableService } from '../../interfaces/injectable-class.js';
import { SERVICE_INJECTION } from '../../symbols.js';
import { hasServiceInjection } from './ensure-service-injection.js';

export interface ServiceInjection {
  name: string | symbol | unknown;
  propertyKey: string | symbol;
}

/**
 * Prepare constructable to be dependencies injectable
 */
export function patchConstructable<C>(Constructable: Constructable<C>, injectables: Injectables, cacheResult: boolean): void {
  injectProperties(Constructable, Constructable, injectables, cacheResult, Constructable.name);
  injectProperties(Constructable.prototype, Constructable.prototype, injectables, cacheResult, Constructable.name);
}

/**
 * Injects dependencies into instantiated class
 */
export function injectDependenciesIntoInstance<C>(instance: C, Constructable: Constructable<C>, injectables: Injectables, cacheResult: boolean): void {
  const tmp = class {};
  for (const key in instance) {
    Object.defineProperty(tmp.prototype, key, {
      set(value) {
        instance[key] = value;
      },
    });
  }

  Reflect.construct(Constructable, getArgumentsList(Constructable, injectables, cacheResult), tmp);
  injectProperties(instance, Constructable.prototype, injectables, cacheResult, Constructable.name);
}

function getArgumentsList<C>(Constructable: Constructable<C>, injectables: Map<string | symbol | unknown, InjectableService>, cacheResult: boolean) {
  const metadata: unknown[] = Reflect.getMetadata('design:paramtypes', Constructable) || [];
  return metadata
    .map((value) => injectables.get(value))
    .map((value: InjectableService | undefined) => {
      if (value) return value[CREATOR].register(injectables, cacheResult);
      throw new TypeError(`Invalid argument provided in ${Constructable.name}'s constructor. Expected class annotated with @Service.`);
    });
}

/**
 * Creates class with dependencies specified in constructor
 */
export function createWithConstructorDependencies<C>(Constructable: Constructable<C>, injectables: Injectables, cacheResult: boolean): C {
  const argumentsList = getArgumentsList(Constructable, injectables, cacheResult);

  return Reflect.construct(Constructable, argumentsList);
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
      writable: true,
    });
  }
}
