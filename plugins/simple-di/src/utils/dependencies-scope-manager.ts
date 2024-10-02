import { FastifyInstance } from 'fastify';
import { Scope } from 'fastify-decorators/plugins';

const scopedInstances = new WeakMap<Scope, Map<object, object>>();
const destructorsRegistry = new FinalizationRegistry<() => void>((destructor) => destructor());

export const dependencyScopeManager = {
  registerInstance(scope: Scope, dependency: object, instance: unknown): void {
    const instances = scopedInstances.get(scope) ?? new Map();
    instances.set(dependency, instance);
    scopedInstances.set(scope, instances);
  },

  registerDestructor(scope: Scope, destructor: () => void): void {
    destructorsRegistry.register(scope, destructor);
  },

  hasInstance(scope: Scope, dependency: object): boolean {
    const instances = dependencyScopeManager.resolveScope(scope);
    return !!instances && instances.has(dependency);
  },

  getInstance(scope: Scope, dependency: object): object | undefined {
    const instances = dependencyScopeManager.resolveScope(scope);
    if (!instances) return;
    return instances.get(dependency);
  },

  resolveScope(scope: Scope): Map<object, object> | undefined {
    if (scopedInstances.has(scope)) return scopedInstances.get(scope);
    if ('context' in scope) return dependencyScopeManager.resolveScope(scope.server as FastifyInstance);
    return undefined;
  },
};
