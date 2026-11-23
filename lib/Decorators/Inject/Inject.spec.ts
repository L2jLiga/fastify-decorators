import { InjectablesMap } from '../../Registry/_injectables-holder.js';
import { SERVICE_INJECTION } from '../../Symbols/index.js';
import { ServiceInjection,ClassPropsHelper } from '../Helpers/index.js';
import { Inject } from './Inject.js';

describe('Decorator: @Inject', () => {
  const injectables: InjectablesMap = new Map();
  afterEach(() => injectables.clear());

  const InjectToken = Symbol('Token');

  it('should create metadata for inject', () => {
    class Target {
      @Inject(InjectToken)
      srv: unknown;
    }

    if (!ClassPropsHelper.hasServiceInjection(Target.prototype)) throw new Error('Inject does not work, please check');

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

    if (!ClassPropsHelper.hasServiceInjection(Target.prototype)) throw new Error('Inject does not work, please check');

    const viaInject: ServiceInjection[] = [...Target.prototype[SERVICE_INJECTION]];

    expect(viaInject).toHaveLength(2);
    expect(viaInject[0]).toEqual({ propertyKey: 'srv', name: InjectToken });
    expect(viaInject[1]).toEqual({ propertyKey: 'srv2', name: InjectToken });
  });
});
