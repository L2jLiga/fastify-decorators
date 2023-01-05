import 'reflect-metadata';

import { classLoaderFactory } from '../decorators/helpers/inject-dependencies.js';
import { Service } from '../decorators/service.js';
import { _injectablesHolder } from '../registry/_injectables-holder.js';
import { defaultScope } from './dependencies-scope-manager.js';
import { getInstanceByToken } from './get-instance-by-token.js';

describe('Get instance by token', function () {
  beforeEach(() => {
    _injectablesHolder.reset();
  });

  it('should throw exception when injectable not found by token', () => {
    const token = 'pseudoToken';
    expect(() => getInstanceByToken(token)).toThrow('Injectable not found for token "pseudoToken"');
  });

  it('should return instance from injectables', () => {
    const serviceInstance = {};
    const token = 'pseudoToken';
    _injectablesHolder.injectSingleton(token, serviceInstance, false);

    const result = getInstanceByToken(token);

    expect(result).toBe(serviceInstance);
  });

  it('should be able to get instance created by class loader', () => {
    const classLoader = classLoaderFactory(_injectablesHolder);
    @Service()
    class MyService {}

    const serviceFromClassLoader = classLoader(MyService, defaultScope);
    const result = getInstanceByToken(MyService);

    expect(result).toBe(serviceFromClassLoader);
  });
});
