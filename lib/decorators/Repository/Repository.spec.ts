import { _injectablesHolder } from '../../Registry/_injectables-holder.js';
import { CREATOR, INITIALIZER } from '../../Symbols/index.js';
import { getInstanceByToken } from '../../Utils/get-instance-by-token.js';
import { classLoaderFactory } from '../Helpers/inject-dependencies.js';
import { Repository } from './Repository.js';

describe('Decorators: @Repository', () => {
  beforeEach(() => _injectablesHolder.reset());
  afterEach(() => _injectablesHolder.reset());

  it('should add CREATOR static property to class', () => {
    @Repository()
    class Repo {}

    // @ts-expect-error TypeScript does not know about patches within decorator
    expect(Repo[CREATOR]).toBeTruthy();
  });

  it('should create service', () => {
    const classLoader = classLoaderFactory(_injectablesHolder);

    @Repository()
    class Repo {}

    // @ts-expect-error TypeScript does not know about patches within decorator
    const instance = Repo[CREATOR].register(classLoader);

    expect(instance).toBeDefined();
  });

  it('should call initializer when instantiate service', () => {
    const classLoader = classLoaderFactory(_injectablesHolder);

    @Repository()
    class Repo {
      static [INITIALIZER] = jest.fn((srv: unknown) => {
        expect(srv).toBeInstanceOf(Repo);
      });
    }

    // @ts-expect-error TypeScript does not know about patches within decorator
    Repo[CREATOR].register(classLoader);

    expect(Repo[INITIALIZER]).toHaveBeenCalled();
  });

  it('should return same instance if service created multiple times', () => {
    const classLoader = classLoaderFactory(_injectablesHolder);

    @Repository()
    class Repo {}

    // @ts-expect-error TypeScript does not know about patches within decorator
    const instance1 = Repo[CREATOR].register(classLoader);
    // @ts-expect-error TypeScript does not know about patches within decorator
    const instance2 = Repo[CREATOR].register(classLoader);
    // @ts-expect-error TypeScript does not know about patches within decorator
    const instance3 = Repo[CREATOR].register(classLoader);

    expect(instance1).toBe(instance2);
    expect(instance1).toBe(instance3);
    expect(instance2).toBe(instance3);
  });

  it('should register service by injectable token and class', () => {
    @Repository('token')
    class Repo {}

    const instanceByClass = getInstanceByToken(Repo);
    const instanceByToken = getInstanceByToken('token');

    expect(instanceByClass).toBeInstanceOf(Repo);
    expect(instanceByToken).toBeInstanceOf(Repo);
  });
});
