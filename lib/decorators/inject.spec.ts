import { Injectables } from '../interfaces/injectable-class.js';
import { SERVICE_INJECTION } from '../symbols/index.js';
import { hasServiceInjection } from './helpers/class-properties.js';
import { ServiceInjection } from './helpers/inject-dependencies.js';
import { Inject } from './inject.js';

describe('Decorator: @Inject', () => {
  const injectables: Injectables = new Map();
  afterEach(() => injectables.clear());

  const InjectToken = Symbol('Token');

  it('should create metadata for inject', () => {
    class Target {
      @Inject(InjectToken)
      srv: unknown;
    }

    if (!hasServiceInjection(Target.prototype)) throw new Error('Inject does not work, please check');

    const viaInject: ServiceInjection[] = [...Target.prototype[SERVICE_INJECTION]];

    expect(viaInject).toHaveLength(1);
    expect(viaInject[0]).toEqual({ propertyKey: 'srv', name: InjectToken });
  });

  it('should not override metadata when it exists', () => {
    class Target {
      @Inject(InjectToken)
      srv: unknown;

      @Inject(InjectToken)
      srv2: unknown;
    }

    if (!hasServiceInjection(Target.prototype)) throw new Error('Inject does not work, please check');

    const viaInject: ServiceInjection[] = [...Target.prototype[SERVICE_INJECTION]];

    expect(viaInject).toHaveLength(2);
    expect(viaInject[0]).toEqual({ propertyKey: 'srv', name: InjectToken });
    expect(viaInject[1]).toEqual({ propertyKey: 'srv2', name: InjectToken });
  });
});
