/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { fastify, FastifyInstance } from 'fastify';
import { Constructable, CREATOR } from 'fastify-decorators/plugins';
import { readyMap } from '../decorators/initializer.js';
import type { InjectableService } from '../interfaces/injectable-class.js';
import { injectables } from '../registry/injectables.js';
import { FastifyInstanceToken, INITIALIZER } from '../symbols.js';
import { wrapInjectable } from '../utils/wrap-injectable.js';
import { loadPlugins, Plugins } from './fastify-plugins.js';
import { MocksManager } from './mocks-manager.js';
import type { ServiceMock } from './service-mock.js';

export interface ServiceTestConfig<Service> {
  service: Constructable<Service>;
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
  const service: Constructable<Service> = config.service;

  const withInstance = new Map(injectables);
  const fastifyInstance = config.instance ?? fastify();
  loadPlugins(fastifyInstance, config.plugins);
  withInstance.set(FastifyInstanceToken, wrapInjectable(fastifyInstance));

  const injectablesWithMocks = MocksManager.create(withInstance, config.mocks);

  isInjectable(service);
  const instance = service[CREATOR].register<Service>(injectablesWithMocks, false);

  let promise: Promise<unknown> | null = null;

  // @ts-expect-error TS doesn't know that we have class instance here
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

function isInjectable<Service>(service: Constructable<Service>): asserts service is InjectableService {
  if (!(Symbol.for('fastify-decorators.creator') in service)) {
    throw new Error('Provided service does not annotated with @Service!');
  }
}

function hasAsyncInitializer(service: InjectableService): service is InjectableService & Required<InjectableService> {
  return INITIALIZER in service;
}
