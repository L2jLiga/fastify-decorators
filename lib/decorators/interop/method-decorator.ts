import { getMetadata } from './metadata.js';

/**
 * Method decorator signature usable for both ESM and Legacy decorators
 */
export type CombinedMethodDecorator = (target: object, ctx: ClassMethodDecoratorContext | ClassFieldDecoratorContext | PropertyKey) => void;

export function methodDecoratorFactory(
  factory: (target: object, metadata: Record<PropertyKey, unknown>, propertyKey: PropertyKey) => void,
): CombinedMethodDecorator {
  return function (target, handlerName) {
    if (typeof handlerName === 'object' && 'kind' in handlerName) {
      const metadata = handlerName.metadata;
      factory(target as object, metadata as DecoratorMetadataObject, handlerName.name);
    } else {
      const metadata = getMetadata(target.constructor);
      factory(target as object, metadata, handlerName);
    }
  };
}
