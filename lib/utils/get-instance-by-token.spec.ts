import { InjectableService } from '../interfaces/injectable-class.js';
import { injectables } from '../registry/injectables.js';
import { CREATOR, FASTIFY_REPLY, FASTIFY_REQUEST, FastifyReplyToken, FastifyRequestToken } from '../symbols/index.js';
import { getInstanceByToken } from './get-instance-by-token.js';
import { wrapInjectable } from './wrap-injectable.js';

describe('Get instance by token', function () {
  beforeEach(() => {
    injectables.clear();
    injectables.set(FastifyRequestToken, wrapInjectable(FASTIFY_REQUEST));
    injectables.set(FastifyReplyToken, wrapInjectable(FASTIFY_REPLY));
  });

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
