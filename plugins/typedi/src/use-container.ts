import { CLASS_LOADER, createInitializationHook } from 'fastify-decorators/plugins';
import { Constructable } from 'fastify-decorators/plugins';
import type { Container as TypeDIContainer, ServiceOptions } from 'typedi';

export function useContainer(Container: typeof TypeDIContainer) {
  createInitializationHook('appInit', (fastifyInstance) => fastifyInstance.decorate(CLASS_LOADER, (target: Constructable) => Container.get(target)));
  createInitializationHook('beforeControllerCreation', (fastifyInstance, target) => {
    const controllerMetadata: ServiceOptions = {
      id: target,
      type: target,
    };

    Container.set(controllerMetadata);
  });
}
