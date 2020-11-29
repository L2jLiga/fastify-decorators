import { InjectableService } from '../interfaces/injectable-class';
import { injectables } from '../registry/injectables';
import { CREATOR } from '../symbols';
import { getInstanceByToken } from './get-instance-by-token';
import { wrapInjectable } from './wrap-injectable';

describe('Get instance by token', function () {
  beforeEach(() => injectables.clear());

  it('should throw exception when injectable not found by token', () => {
    const token = 'pseudoToken';
    expect(() => getInstanceByToken(token)).toThrowError('Injectable not found for token "pseudoToken"');
  });

  it('should return instance from injectables', () => {
    const serviceInstance = {};
    const token = 'pseudoToken';
    injectables.set(token, <InjectableService>{
      [CREATOR]: {
        register() {
          return serviceInstance;
        },
      },
    });

    const result = getInstanceByToken(token);

    expect(result).toBe(serviceInstance);
  });

  it('should extract manually wrapped object', () => {
    const serviceInstance = {};
    const token = 'pseudoToken';
    injectables.set(token, wrapInjectable(serviceInstance));

    const result = getInstanceByToken(token);

    expect(result).toBe(serviceInstance);
  });
});
