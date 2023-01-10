/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { Constructable, Scope } from 'fastify-decorators/plugins';

const scopedInstances = new WeakMap<Scope, Map<Constructable<unknown>, unknown>>();
const destructorsRegistry = new FinalizationRegistry<() => void>((destructor) => destructor());

export const dependencyScopeManager = {
  registerInstance(scope: Scope, dependency: Constructable<unknown>, instance: unknown): void {
    const instances = scopedInstances.get(scope) ?? new Map();
    instances.set(dependency, instance);
    scopedInstances.set(scope, instances);
  },

  registerDestructor(scope: Scope, destructor: () => void): void {
    destructorsRegistry.register(scope, destructor);
  },

  hasInstance(scope: Scope, dependency: Constructable<unknown>): boolean {
    const instances = dependencyScopeManager.resolveScope(scope);
    return !!instances && instances.has(dependency);
  },

  getInstance(scope: Scope, dependency: Constructable<unknown>): unknown | undefined {
    const instances = dependencyScopeManager.resolveScope(scope);
    if (!instances) return;
    return instances.get(dependency);
  },

  resolveScope(scope: Scope): Map<Constructable<unknown>, unknown> | undefined {
    if (scopedInstances.has(scope)) return scopedInstances.get(scope);
    if ('context' in scope) return dependencyScopeManager.resolveScope(scope.server);
    return undefined;
  },
};
