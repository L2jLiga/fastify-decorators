import { GET } from '../decorators';
import { Controller } from '../decorators/controller';
import { Service } from '../decorators/service';
import { configureControllerTest, ServiceMock } from './configure-controller-test';

describe('Testing utilities: bootstrap test controller', () => {
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
