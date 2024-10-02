// @ts-expect-error no types for Symbol.metadata yet
if (Symbol.metadata == null) {
  Object.defineProperty(Symbol, 'metadata', {
    value: Symbol('Symbol.metadata'),
  });
}
