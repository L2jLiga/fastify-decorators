/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { fastify, FastifyInstance } from 'fastify';
import { DepScopeHelper,classLoaderFactory,type Constructor } from '../Decorators/Helpers/index.js';
import { initializersMap } from '../Decorators/Initializer/Initializer.js';
import { ClassLoader } from '../Interfaces/index.js';
import type { InjectableService } from '../Interfaces/injectable-class.js';
import { _injectablesHolder } from '../Registry/_injectables-holder.js';
import { CLASS_LOADER, CREATOR, FastifyInstanceToken, INITIALIZER } from '../Symbols/index.js';
import { loadPlugins, Plugins } from './FastifyPlugins.js';
import { MocksManager } from './MocksManager.js';
import type { ServiceMock } from './ServiceMock.js';


export interface ServiceTestConfig<Service> {
  service: Constructor<Service>;
  instance?: FastifyInstance;
  mocks?: ServiceMock[];
  plugins?: Plugins;
}

/**
 * Configures service for testing
 * @param config with service and mocks
 * @returns configured service & promise which resolves when async initializer done (if it exists, otherwise resolved)
 */
export function configureServiceTest<Service>(config: ServiceTestConfig<Service>): Promise<Service> & Service {
  const service: Constructor<Service> = config.service;
  isInjectable(service);

  const injectablesWithMocks = MocksManager.create(_injectablesHolder, config.mocks);
  if (config.instance) injectablesWithMocks.injectSingleton(FastifyInstanceToken, config.instance);
  if (!injectablesWithMocks.has(FastifyInstanceToken)) injectablesWithMocks.injectSingleton(FastifyInstanceToken, fastify(), false);

  const fastifyInstance = injectablesWithMocks.getSingleton<FastifyInstance>(FastifyInstanceToken) as FastifyInstance;
  const classLoader = classLoaderFactory(injectablesWithMocks) as ClassLoader & { reset(scope: DepScopeHelper.DependencyScope): void };
  classLoader.reset(DepScopeHelper.defaultScope);
  if (!fastifyInstance.hasDecorator(CLASS_LOADER)) fastifyInstance.decorate(CLASS_LOADER, classLoader);

  loadPlugins(fastifyInstance, config.plugins);

  const instance = service[CREATOR].register<Service>(classLoader);

  let promise: Promise<unknown> | null = null;

  // @ts-expect-error TS doesn't know that we have class instance here
  return new Proxy(instance, {
    get<T>(target: T, p: keyof T | 'then' | 'catch' | 'finally') {
      if (p === 'then' || p === 'catch' || p === 'finally') {
        if (promise == null)
          promise = hasAsyncInitializer(service)
            ? // @ts-expect-error if service has async initializer then it exists in readyMap
              initializersMap.get(service).then(() => target)
            : Promise.resolve(target);

        return promise[p as 'then' | 'catch' | 'finally'].bind(promise);
      }

      return target[p];
    },
  }) as Promise<Service> & Service;
}

function isInjectable<Service>(service: Constructor<Service>): asserts service is InjectableService {
  if (!(CREATOR in service)) {
    throw new Error('Provided service does not annotated with @Service!');
  }
}

function hasAsyncInitializer(service: InjectableService): service is InjectableService & Required<InjectableService> {
  return INITIALIZER in service;
}
