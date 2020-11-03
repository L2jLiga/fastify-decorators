import { Inject } from './inject';
import { wrapInjectable } from '../utils/wrap-injectable';
import { Injectables, InjectableService } from '../interfaces/injectable-class';
import { INJECTABLES } from '../symbols';

describe('Decorator: @Inject', () => {
    const injectables: Injectables = new Map();
    afterEach(() => injectables.clear());

    const injectable = Symbol('injectable');

    it('should define getter for property', () => {
        const injectableInst = {};
        injectables.set(injectable, wrapInjectable(injectableInst));

        class Target {
            [INJECTABLES] = injectables;

            @Inject(injectable)
            prop!: Record<never, never>;
        }

        const target = new Target();

        expect(target.prop).toBe(injectableInst);
    });

    it('should return undefined while accessing property when injectable not annotated', () => {
        const injectableInst = <InjectableService>{};
        injectables.set(injectable, injectableInst);

        class Target {
            [INJECTABLES] = injectables;

            @Inject(injectable)
            prop!: Record<never, never>;
        }

        const target = new Target();

        expect(target.prop).toBe(undefined);
    });

    it('should return undefined while accessing property when injectable not found', () => {
        class Target {
            [INJECTABLES] = injectables;

            @Inject(injectable)
            prop!: Record<never, never>;
        }

        const target = new Target();

        expect(target.prop).toBe(undefined);
    });
});
