import { Controller, GET, Initializer, Inject, Service } from '../decorators';
import { configureControllerTest } from './configure-controller-test';
import { ServiceMock } from './service-mock';

describe('Testing: configure controller test', () => {
    it('should bootstrap controller', async () => {
        const instance = await configureControllerTest({ controller: WithoutDependencies });

        const result = await instance.inject('/index');

        expect(result.body).toBe('{"message":"ok"}');
    });

    it('should bootstrap controller with mocked dependency', async () => {
        const serviceMock: ServiceMock = {
            provide: DependencyService,
            useValue: { message: 'la-la-la' },
        };
        const instance = await configureControllerTest({
            controller: WithDependencies,
            mocks: [serviceMock],
        });

        const result = await instance.inject('/index');

        expect(result.body).toBe('{"message":"la-la-la"}');
    });

    it('should bootstrap controller with async service', async () => {
        const instance = await configureControllerTest({
            controller: WithAsyncServiceInjected,
        });

        const result = await instance.inject('/index');

        expect(result.body).toBe('{"message":"ok"}');
    });

    it('should not cache results', async () => {
        const serviceMock: ServiceMock = {
            provide: DependencyService,
            useValue: { message: 'la-la-la' },
        };
        const instance = await configureControllerTest({
            controller: WithDependencies,
            mocks: [serviceMock],
        });
        const result = await instance.inject('/index');
        expect(result.body).toBe('{"message":"la-la-la"}');

        const instance2 = await configureControllerTest({ controller: WithDependencies });
        const result2 = await instance2.inject('/index');

        expect(result2.body).toBe('{"message":"ok"}');
    });

    it('should be able to mock dependencies given via @Inject', async () => {
        const serviceMock: ServiceMock = {
            provide: DependencyService,
            useValue: { message: 'la-la-la' },
        };
        const instance = await configureControllerTest({
            controller: UsingInjectDecorator,
            mocks: [serviceMock],
        });
        const result = await instance.inject('/index');
        expect(result.body).toBe('{"message":"la-la-la"}');

        const instance2 = await configureControllerTest({ controller: UsingInjectDecorator });
        const result2 = await instance2.inject('/index');

        expect(result2.body).toBe('{"message":"ok"}');
    });
});

@Controller()
class WithoutDependencies {
    @GET('/index')
    async getAll() {
        return { message: 'ok' };
    }
}

@Service()
class DependencyService {
    get message() {
        return 'ok';
    }
}

@Service()
class AsyncService {
    initialized = false;

    @Initializer()
    async init() {
        this.initialized = true;
    }
}

@Controller()
class WithDependencies {
    constructor(private service: DependencyService) {
    }

    @GET('/index')
    async getAll() {
        const message = this.service.message;
        return { message };
    }
}

@Controller()
class UsingInjectDecorator {
    @Inject(DependencyService)
    private service!: DependencyService;

    @GET('/index')
    async getAll() {
        const message = this.service.message;
        return { message };
    }
}

@Controller()
class WithAsyncServiceInjected {
    @Inject(AsyncService)
    private service!: AsyncService;

    @GET('/index')
    async getAll() {
        const message = this.service.initialized ? 'ok' : 'fail';
        return { message };
    }
}
