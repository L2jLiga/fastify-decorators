/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { FastifyInstance, FastifyRequest } from 'fastify';
import { Constructor } from './inject-dependencies.js';

export type DependencyScope = FastifyInstance | FastifyRequest;

const scopedInstances = new WeakMap<DependencyScope, Map<Constructor<unknown>, unknown>>();

export const defaultScope = {} as DependencyScope;

export const dependencyScopeManager = {
  add(scope: DependencyScope, dependency: Constructor<unknown>, instance: unknown): void {
    const instances = scopedInstances.get(scope) || new Map<Constructor<unknown>, unknown>();
    instances.set(dependency, instance);
    scopedInstances.set(scope, instances);
  },

  has(scope: DependencyScope, dependency: Constructor<unknown>): boolean {
    return scopedInstances.has(scope) && (scopedInstances.get(scope) as Map<Constructor<unknown>, unknown>).has(dependency);
  },

  get(scope: DependencyScope, dependency: Constructor<unknown>): unknown | undefined {
    if (!scopedInstances.has(scope)) return;
    const instances = scopedInstances.get(scope) as Map<Constructor<unknown>, unknown>;
    return instances.get(dependency);
  },
  clear(scope: DependencyScope): void {
    scopedInstances.delete(scope);
  },
};
