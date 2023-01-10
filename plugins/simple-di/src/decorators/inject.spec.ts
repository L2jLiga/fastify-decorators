import { SERVICE_INJECTION } from '../symbols.js';
import { Container } from '../utils/container.js';
import { ServiceInjection } from './helpers/inject-dependencies.js';
import { Inject } from './inject.js';

describe('Decorator: @Inject', () => {
  const InjectToken = Symbol('Token');

  it('should create metadata for inject', () => {
    class Target {
      @Inject(InjectToken)
      srv: unknown;
    }

    // @ts-expect-error SERVICE_INJECTION implicitly created by @Inject
    const viaInject: Container<ServiceInjection> = Target.prototype[SERVICE_INJECTION];

    expect(viaInject).toHaveLength(1);
    expect([...viaInject][0]).toEqual({ propertyKey: 'srv', name: InjectToken });
  });

  it('should not override metadata when it exists', () => {
    class Target {
      @Inject(InjectToken)
      srv: unknown;

      @Inject(InjectToken)
      srv2: unknown;
    }

    // @ts-expect-error SERVICE_INJECTION implicitly created by @Inject
    const viaInject: Container<ServiceInjection> = Target.prototype[SERVICE_INJECTION];

    expect(viaInject).toHaveLength(2);
    expect([...viaInject][0]).toEqual({ propertyKey: 'srv', name: InjectToken });
    expect([...viaInject][1]).toEqual({ propertyKey: 'srv2', name: InjectToken });
  });
});
