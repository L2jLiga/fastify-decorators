import 'reflect-metadata';

import { FastifyInstance, FastifyPluginAsync, FastifyPluginCallback } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { Initializer } from '../decorators/initializer.js';
import { Inject } from '../decorators/inject.js';
import { Service } from '../decorators/service.js';
import { FastifyInstanceToken } from '../symbols.js';
import { configureServiceTest } from './configure-service-test.js';
import { ServiceMock } from './service-mock.js';
import { jest } from '@jest/globals';

describe('Testing: configure service test', () => {
  afterEach(() => jest.clearAllMocks());

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
      provide: ServiceWithoutDependencies,
      useValue: {
        main() {
          return false;
        },
      },
    };
    const service = configureServiceTest({ service: ServiceWithInjection, mocks: [srv] });

    const result = service.main();

    expect(result).toBe(false);
  });

  it('should throw error when instantiating class without service decorator', () => {
    expect(() =>
      configureServiceTest({
        service: class {},
        mocks: [],
      }),
    ).toThrow();
  });

  it('should inject fastify instance', () => {
    const service = configureServiceTest({
      service: WithFastifyInstance,
    });

    expect(typeof service.getVersion()).toBe('string');
  });

  it('should use custom fastify instance', () => {
    const instance = { version: 'CUSTOM VERSION' } as FastifyInstance;
    const service = configureServiceTest({
      service: WithFastifyInstance,
      instance,
    });

    expect(service.getVersion()).toBe(instance.version);
  });

  it('should be able to load plugins onto fastify instance', async () => {
    interface Ops {
      key: null;
    }
    interface OpsAsync {
      promise: PromiseConstructor;
    }
    const pluginCallback = fastifyPlugin<Ops>(((instance, opts, next) => {
      instance.decorate('pluginOpts', opts);
      next();
    }) as FastifyPluginCallback);
    const pluginAsync = fastifyPlugin<OpsAsync>((async (instance, opts) => {
      instance.decorate('pluginAsyncOpts', opts);
    }) as FastifyPluginAsync);

    const service = configureServiceTest({
      service: WithFastifyInstance,
      plugins: [pluginCallback, [pluginAsync, { promise: Promise }]],
    });

    await service.instance.ready();

    expect(service.instance.hasDecorator('pluginOpts')).toBeTruthy();
    expect(service.instance.hasDecorator('pluginAsyncOpts')).toBeTruthy();
    // @ts-expect-error we do not enhance FastifyInstance typings in "plugin" hence we expect this error
    expect(service.instance.pluginOpts).toEqual({});
    // @ts-expect-error we do not enhance FastifyInstance typings in "plugin" hence we expect this error
    expect(service.instance.pluginAsyncOpts.promise).toBe(Promise);
  });

  it('should not override mocked injection of fastify instance', () => {
    const service = configureServiceTest({
      service: WithFastifyInstance,
      mocks: [
        {
          provide: FastifyInstanceToken,
          useValue: {
            get version() {
              return '0.0.0';
            },
          },
        },
      ],
    });

    expect(service.getVersion()).toBe('0.0.0');
  });

  describe('async service setup', () => {
    it(`should be able to configure async service`, async () => {
      const service = configureServiceTest({ service: AsyncService });

      expect(service.initialized).toBe(false);

      await service;

      expect(service.initialized).toBe(true);
    });

    it(`should not call initializer twice`, async () => {
      const service = configureServiceTest({ service: AsyncService });
      jest.spyOn(service, 'init');

      await service.then();
      await service.then();
      await service.then();

      expect(service.init).toHaveBeenCalledTimes(1);
    });

    it('should be able to catch error in async initializer', () =>
      new Promise<void>((resolve, reject) =>
        configureServiceTest({ service: AsyncInvalidService })
          .catch(() => resolve())
          .finally(() => reject()),
      ));

    describe('Compatibility with Promise', () => {
      it('should support then with one argument', () =>
        new Promise<void>((resolve, reject) =>
          configureServiceTest({ service: AsyncService })
            .then(() => resolve())
            .finally(() => reject()),
        ));

      it('should support then with two arguments', () =>
        new Promise<void>((resolve, reject) =>
          configureServiceTest({ service: AsyncInvalidService }).then(
            () => reject(),
            () => resolve(),
          ),
        ));

      it('should support catch', () =>
        new Promise<void>((resolve, reject) =>
          configureServiceTest({ service: AsyncInvalidService })
            .catch(() => resolve())
            .finally(() => reject()),
        ));

      it('should support finally', () => new Promise<void>((resolve) => configureServiceTest({ service: AsyncService }).finally(() => resolve())));

      it('should not fail with services without initializer', () =>
        new Promise<void>((resolve) => configureServiceTest({ service: ServiceWithoutDependencies }).finally(() => resolve())));
    });
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
  constructor(private srv: ServiceWithoutDependencies) {}

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

@Service()
class AsyncService {
  initialized = false;

  @Initializer()
  async init() {
    this.initialized = true;
  }
}

@Service()
class AsyncInvalidService {
  @Initializer()
  async init() {
    throw new Error('Invalid');
  }
}

@Service()
class WithFastifyInstance {
  @Inject(FastifyInstanceToken)
  instance!: FastifyInstance;

  getVersion() {
    return this.instance.version;
  }
}
