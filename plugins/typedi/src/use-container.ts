import { CLASS_LOADER, createInitializationHook } from 'fastify-decorators/plugins';
import type { Container as TypeDIContainer, ServiceOptions, Constructable } from 'typedi';

export function useContainer(Container: typeof TypeDIContainer) {
  createInitializationHook('appInit', (fastifyInstance) => fastifyInstance.decorate(CLASS_LOADER, (target: object) => Container.get(target)));
  createInitializationHook('beforeControllerCreation', (fastifyInstance, target) => {
    const controllerMetadata: ServiceOptions = {
      id: target,
      type: target as Constructable<unknown>,
    };

    Container.set(controllerMetadata);
  });
}
