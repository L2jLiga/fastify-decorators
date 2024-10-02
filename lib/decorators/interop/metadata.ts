export function getMetadata<T extends object>(target: T): Record<PropertyKey, unknown> {
  ensureMetadata(target);
  // @ts-expect-error no types for Symbol.metadata yet
  return target[Symbol.metadata];
}

// @ts-expect-error no types for Symbol.metadata yet
function ensureMetadata<T extends object>(target: T): asserts target is T & { [Symbol.metadata]: Record<symbol, unknown> } {
  // @ts-expect-error no types for Symbol.metadata yet
  if (!Object.prototype.hasOwnProperty.call(target, Symbol.metadata)) {
    const metadata = {};
    // @ts-expect-error no types for Symbol.metadata yet
    if (Symbol.metadata in target) {
      // @ts-expect-error no types for Symbol.metadata yet
      const parentMetadata = target[Symbol.metadata] as Record<PropertyKey, unknown>;
      Object.setPrototypeOf(metadata, parentMetadata);
    }
    // @ts-expect-error no types for Symbol.metadata yet
    Reflect.defineProperty(target, Symbol.metadata, {
      value: metadata,
      enumerable: false,
      configurable: true,
      writable: false,
    });
  }
}
