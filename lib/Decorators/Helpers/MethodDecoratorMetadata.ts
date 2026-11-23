export interface StandardMethodDecoratorContext {
  readonly kind: 'method';
  readonly name: string | symbol;
  readonly static: boolean;
  readonly private: boolean;
}

type MethodMetadataRegistrar = (constructor: Function, methodName: string | symbol) => void;

const pendingMetadata = new WeakMap<Function, MethodMetadataRegistrar[]>();
const collectedConstructors = new WeakSet<Function>();

export function deferStandardMethodMetadata(method: Function, context: StandardMethodDecoratorContext, register: MethodMetadataRegistrar): void {
  if (context.private) throw new TypeError('Decorated methods must be public instance methods');
  if (context.static) throw new TypeError('Decorated methods must be public instance methods');

  const registrations = pendingMetadata.get(method) ?? [];
  registrations.push(register);
  pendingMetadata.set(method, registrations);
}

export function collectStandardMethodMetadata(target: Function): void {
  let prototype = target.prototype as object | null | undefined;

  while (prototype && prototype !== Object.prototype) {
    const constructor = (prototype as { constructor: Function }).constructor;
    if (!collectedConstructors.has(constructor)) {
      collectedConstructors.add(constructor);
      for (const methodName of Reflect.ownKeys(prototype)) {
        const method = Object.getOwnPropertyDescriptor(prototype, methodName)?.value;
        if (typeof method !== 'function') continue;

        for (const register of pendingMetadata.get(method) ?? []) {
          register(constructor, methodName);
        }
      }
    }

    prototype = Object.getPrototypeOf(prototype);
  }
}
