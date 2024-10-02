import { fastify, FastifyInstance } from 'fastify';
import { classLoaderFactory } from '../decorators/helpers/inject-dependencies.js';
import { readyMap } from '../decorators/initializer.js';
import type { InjectableService } from '../interfaces/injectable-class.js';
import { _injectablesHolder } from '../registry/_injectables-holder.js';
import { FastifyInstanceToken, INITIALIZER } from '../symbols.js';
import { loadPlugins, Plugins } from './fastify-plugins.js';
import { MocksManager } from './mocks-manager.js';
import type { ServiceMock } from './service-mock.js';
import { CLASS_LOADER } from 'fastify-decorators/plugins/class-loader.js';
import { REGISTRABLE } from 'fastify-decorators/constants/symbols.js';

export interface ServiceTestConfig<Service extends object> {
  // FIXME: avoid any, find better solution
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  service: { new (...args: any): Service };
  instance?: FastifyInstance;
  mocks?: ServiceMock[];
  plugins?: Plugins;
}

/**
 * Configures service for testing
 * @param config - object that contains service and mocks
 * @returns configured service & promise which resolves when async initializer done (if it exists, otherwise resolved)
 */
export function configureServiceTest<Service extends object>(config: ServiceTestConfig<Service>): Promise<Service> & Service {
  const service = config.service as InjectableService & typeof config.service;

  const fastifyInstance = config.instance ?? fastify();
  loadPlugins(fastifyInstance, config.plugins);

  const injectablesWithMocks = MocksManager.create(_injectablesHolder, config.mocks);
  injectablesWithMocks.injectSingleton(FastifyInstanceToken, fastifyInstance, false);

  const classLoader = classLoaderFactory(injectablesWithMocks);
  fastifyInstance.decorate(CLASS_LOADER, classLoader);

  isInjectable(service);
  const instance = service[REGISTRABLE](fastifyInstance[CLASS_LOADER], fastifyInstance);

  let promise: Promise<unknown> | null = null;

  return new Proxy(instance, {
    get<T>(target: T, p: keyof T | 'then' | 'catch' | 'finally') {
      if (isPromiseLikeAccess<T>(p)) {
        if (promise == null)
          promise = hasAsyncInitializer(service)
            ? // @ts-expect-error if service has async initializer then it exists in readyMap
              readyMap.get(service).then(() => target)
            : Promise.resolve(target);

        return promise[p].bind(promise);
      }

      return target[p];
    },
  }) as Promise<Service> & Service;
}

function isPromiseLikeAccess<T, K extends keyof T = keyof T>(p: K | 'then' | 'catch' | 'finally'): p is 'then' | 'catch' | 'finally' {
  return p === 'then' || p === 'catch' || p === 'finally';
}

function isInjectable<T extends object>(service: T): asserts service is T & InjectableService {
  if (!(REGISTRABLE in service)) {
    throw new Error('Provided service does not annotated with @Service!');
  }
}

function hasAsyncInitializer(service: InjectableService): service is Required<InjectableService> {
  return INITIALIZER in service;
}
