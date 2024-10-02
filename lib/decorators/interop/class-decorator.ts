import { getMetadata } from './metadata.js';

/**
 * Class decorator signature usable for both ESM and Legacy decorators
 */
export type CombinedClassDecorator = <T>(target: T, context?: ClassDecoratorContext) => void;

/**
 * Factory function that creates ESM and Legacy compatible decorator
 */
export function classDecoratorFactory(factory: (target: object, metadata: Record<PropertyKey, unknown>) => unknown): CombinedClassDecorator {
  return (target, context) => {
    if (context?.metadata) {
      factory(target as object, context.metadata);
    } else {
      const metadata = getMetadata(target as abstract new () => unknown);
      factory(target as object, metadata);
    }
  };
}
