import { injectables } from '../registry/injectables';
import { CREATOR } from '../symbols';
import { getInstanceByToken } from './get-instance-by-token';
import { wrapInjectable } from './wrap-injectable';

describe('Get instance by token', function () {
    beforeEach(() => injectables.clear());

    it('should return undefined if injectable is missing', () => {
        const result = getInstanceByToken('pseudoToken');

        expect(result).toBeUndefined();
    });

    it('should return instance from injectables', () => {
        const serviceInstance = {};
        const token = 'pseudoToken';
        injectables.set(token, {
            [CREATOR]: {
                register() {
                    return serviceInstance;
                }
            }
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
