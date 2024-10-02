import { methodDecoratorFactory } from './method-decorator.js';
import { classDecoratorFactory } from './class-decorator.js';

/**
 * Class or Method decorator signature, usable for both ESM and Legacy decorators
 */
export type CombinedClassOrMethodDecorator = (
  target: object,
  propKey?: ClassMethodDecoratorContext | ClassFieldDecoratorContext | ClassDecoratorContext | PropertyKey,
) => void;

export function classOrMethodDecoratorBuilder(
  factory: (target: object, metadata: Record<PropertyKey, unknown>, propertyKey?: PropertyKey) => void,
): CombinedClassOrMethodDecorator {
  return function (target, propertyKey) {
    if (propertyKey && typeof propertyKey !== 'object') {
      methodDecoratorFactory(factory)(target, propertyKey);
      return;
    }
    if (typeof propertyKey === 'object' && (propertyKey.kind === 'field' || propertyKey.kind === 'method')) {
      methodDecoratorFactory(factory)(target, propertyKey as ClassMethodDecoratorContext);
      return;
    }

    classDecoratorFactory(factory)(target);
  };
}
