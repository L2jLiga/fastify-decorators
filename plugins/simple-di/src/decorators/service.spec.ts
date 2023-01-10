import { jest } from '@jest/globals';
import { FastifyInstance } from 'fastify';
import { CREATOR } from 'fastify-decorators/plugins';
import { InjectableService } from '../interfaces/injectable-class.js';
import { _injectablesHolder } from '../registry/_injectables-holder.js';
import { destructors } from '../registry/destructors.js';
import { DESTRUCTOR, INITIALIZER } from '../symbols.js';
import { classLoaderFactory } from './helpers/inject-dependencies.js';
import { Service } from './service.js';

describe('Decorators: @Service', () => {
  beforeEach(() => _injectablesHolder.reset());
  afterEach(() => _injectablesHolder.reset());

  @Service()
  class _Srv {}
  const Srv = _Srv as InjectableService;

  it('should create new instances for different scopes', () => {
    const classLoader = classLoaderFactory(_injectablesHolder);

    const scope1 = {} as FastifyInstance;
    const scope2 = {} as FastifyInstance;

    const instance1 = Srv[CREATOR].register(classLoader, scope1);
    const instance2 = Srv[CREATOR].register(classLoader, scope2);

    expect(instance1).not.toBe(instance2);
  });

  it('should return same instance if service created multiple times within same scope', () => {
    const classLoader = classLoaderFactory(_injectablesHolder);

    const scope = {} as FastifyInstance;

    const instance1 = Srv[CREATOR].register(classLoader, scope);
    const instance2 = Srv[CREATOR].register(classLoader, scope);
    const instance3 = Srv[CREATOR].register(classLoader, scope);

    expect(instance1).toBe(instance2);
    expect(instance1).toBe(instance3);
  });

  it('should call initializer when instantiate service', () => {
    const classLoader = classLoaderFactory(_injectablesHolder);
    const scope = {} as FastifyInstance;
    const initializerResult = {};
    @Service()
    class TestService extends Srv {
      static [INITIALIZER] = jest.fn((srv: unknown) => {
        expect(srv).toBeInstanceOf(Srv);
        return Promise.resolve(initializerResult);
      });
    }

    TestService[CREATOR].register(classLoader, scope);

    expect(TestService[INITIALIZER]).toHaveBeenCalled();
  });

  it('should register destructor when instantiate service', () => {
    const classLoader = classLoaderFactory(_injectablesHolder);
    const scope = {} as FastifyInstance;
    const destructorFn = jest.fn();

    @Service()
    class TestService extends Srv {
      static [DESTRUCTOR] = 'test';

      test = destructorFn;
    }

    TestService[CREATOR].register(classLoader, scope);
    destructors.get(TestService)?.();

    expect(destructorFn).toHaveBeenCalled();
  });
});
