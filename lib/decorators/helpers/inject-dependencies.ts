/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import type { Injectables, InjectableService } from '../../interfaces/injectable-class';
import { CREATOR, SERVICE_INJECTION } from '../../symbols';
import { hasServiceInjection } from './class-properties';

export type Constructor<T> = { new (): T } | { new (...args: any): T };

export interface ServiceInjection {
  name: string | symbol | unknown;
  propertyKey: string | symbol;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Reflect {
  function getMetadata(metadataKey: 'design:paramtypes', target: unknown): ServiceInjection['name'][] | undefined;
}

export function createWithInjectedDependencies<C>(
  constructor: Constructor<C>,
  injectables: Injectables,
  cacheResult: boolean,
): C {
  if (typeof Reflect.getMetadata !== 'function') return new constructor();

  injectProperties(constructor, injectables, cacheResult, constructor.name);
  injectProperties(constructor.prototype, injectables, cacheResult, constructor.name);

  return new constructor(...getArguments(constructor, injectables, cacheResult, constructor.name));
}

function injectProperties(target: unknown, injectables: Injectables, cacheResult: boolean, className: string) {
  if (!hasServiceInjection(target)) return;
  const viaInject = target[SERVICE_INJECTION];
  for (const { name, propertyKey } of viaInject) {
    if (!injectables.has(name))
      throw new TypeError(
        `Invalid argument provided for "${className}.${String(propertyKey)}". Expected class annotated with @Service.`,
      );

    Object.defineProperty(target, propertyKey, {
      value: injectables.get(name)![CREATOR].register(injectables, cacheResult),
      enumerable: true,
      configurable: true,
    });
  }
}

function getArguments<C>(
  constructor: Constructor<C>,
  injectables: Injectables,
  cacheResult: boolean,
  className: string,
) {
  const metadata = Reflect.getMetadata('design:paramtypes', constructor) || [];
  return metadata
    .map((value) => injectables.get(value))
    .map((value: InjectableService | undefined) => {
      if (value) return value[CREATOR].register(injectables, cacheResult);
      throw new TypeError(
        `Invalid argument provided in ${className}'s constructor. Expected class annotated with @Service.`,
      );
    });
}
