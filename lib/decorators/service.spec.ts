import { CREATOR } from '../symbols';
import { Service } from './service';

describe('Decorators: @Service', () => {
    it('should add CREATOR static property to class', () => {
        @Service()
        class Srv {}

        expect((<any>Srv)[CREATOR]).toBeTruthy();
    });

    it('should create service', () => {
        @Service()
        class Srv {}

        const instance = (<any>Srv)[CREATOR].register();

        expect(instance).toBeDefined();
    });

    it('should return same instance if service created multiple times', () => {
        @Service()
        class Srv {}

        const instance1 = (<any>Srv)[CREATOR].register();
        const instance2 = (<any>Srv)[CREATOR].register();
        const instance3 = (<any>Srv)[CREATOR].register();

        expect(instance1).toBe(instance2);
        expect(instance1).toBe(instance3);
        expect(instance2).toBe(instance3);
    });
});
