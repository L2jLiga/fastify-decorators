import { CREATOR } from '../symbols';
import { Service } from './service';

describe('Decorators: @Service', () => {
    it('should add CREATOR static property to class', () => {
        @Service()
        class Srv {}

        // @ts-expect-error TypeScript does not know about patches within decorator
        expect(Srv[CREATOR]).toBeTruthy();
    });

    it('should create service', () => {
        @Service()
        class Srv {}

        // @ts-expect-error TypeScript does not know about patches within decorator
        const instance = Srv[CREATOR].register();

        expect(instance).toBeDefined();
    });

    it('should return same instance if service created multiple times', () => {
        @Service()
        class Srv {}

        // @ts-expect-error TypeScript does not know about patches within decorator
        const instance1 = Srv[CREATOR].register();
        // @ts-expect-error TypeScript does not know about patches within decorator
        const instance2 = Srv[CREATOR].register();
        // @ts-expect-error TypeScript does not know about patches within decorator
        const instance3 = Srv[CREATOR].register();

        expect(instance1).toBe(instance2);
        expect(instance1).toBe(instance3);
        expect(instance2).toBe(instance3);
    });
});
