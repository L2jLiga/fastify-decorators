import { createInitializationHook } from 'fastify-decorators/plugins';
import type { Container as TypeDIContainer, ServiceOptions } from 'typedi';

export function useContainer(Container: typeof TypeDIContainer) {
  createInitializationHook('beforeControllerCreation', (targetConstructor) => {
    const controllerMetadata: ServiceOptions = {
      id: targetConstructor,
      type: targetConstructor,
    };

    Container.set(controllerMetadata);
  });

  createInitializationHook('afterControllerCreation', (instance, targetConstructor) => {
    Object.assign(instance, Container.get(targetConstructor));
  });
}
