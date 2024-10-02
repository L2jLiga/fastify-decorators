import { CombinedMethodDecorator, methodDecoratorFactory } from './interop/method-decorator.js';
import { getContainer } from '../utils/container-utils.js';
import { HOOK } from '../constants/symbols.js';

/**
 * Registers handler for fastify life-cycle hook
 */
export function Hook(name: string): CombinedMethodDecorator {
  return methodDecoratorFactory((target, metadata, propertyKey) => {
    const container = getContainer(metadata, HOOK);

    container.push({
      name,
      handlerName: propertyKey,
    });
  });
}
