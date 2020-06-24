import { Inject, Service } from '../decorators';
import { configureServiceTest } from './configure-service-test';
import { ServiceMock } from './service-mock';

describe('Testing: configure service test', () => {
    it('should be able to configure test for service without dependencies', () => {
        const service = configureServiceTest({ service: ServiceWithoutDependencies });

        const result = service.main();

        expect(result).toBe(true);
    });

    it(`should be able to configure service and all it's dependencies`, () => {
        const service = configureServiceTest({ service: ServiceWithDependencies });

        const result = service.main();

        expect(result).toBe(true);
    });

    it(`should be able to configure service and mock it's dependencies provided via constructor`, () => {
        const srv: ServiceMock = {
            provide: ServiceWithoutDependencies,
            useValue: {
                main() {
                    return false;
                },
            },
        };
        const service = configureServiceTest({ service: ServiceWithDependencies, mocks: [srv] });

        const result = service.main();

        expect(result).toBe(false);
    });

    it(`should be able to configure service and mock it's dependencies provided via @Inject`, () => {
        const srv: ServiceMock = {
            provide: ServiceWithoutDependencies, useValue: {
                main() {
                    return false;
                },
            },
        };
        const service = configureServiceTest({ service: ServiceWithInjection, mocks: [srv] });

        const result = service.main();

        expect(result).toBe(false);
    });
});

@Service()
class ServiceWithoutDependencies {
    main() {
        return true;
    }
}

@Service()
class ServiceWithDependencies {
    constructor(private srv: ServiceWithoutDependencies) {
    }

    main() {
        return this.srv.main();
    }
}

@Service()
class ServiceWithInjection {
    @Inject(ServiceWithoutDependencies)
    private srv!: ServiceWithoutDependencies;

    main() {
        return this.srv?.main();
    }
}
