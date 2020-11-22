/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import type { Constructor } from '../decorators/helpers/inject-dependencies';
import type { InjectableService } from '../interfaces/injectable-class';
import { injectables } from '../registry/injectables';
import { CREATOR, FastifyInstanceToken, INITIALIZER } from '../symbols';
import { MocksManager } from './mocks-manager';
import type { ServiceMock } from './service-mock';
import { readyMap } from '../decorators';
import { wrapInjectable } from '../utils/wrap-injectable';
import { fastify } from 'fastify';

export interface ServiceTestConfig<Service> {
    service: Constructor<Service>;
    mocks?: ServiceMock[];
}

/**
 * Configures service for testing
 * @param config with service and mocks
 * @returns configured service & promise which resolves when async initializer done (if it exists, otherwise resolved)
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function configureServiceTest<Service extends object>(config: ServiceTestConfig<Service>): Promise<Service> & Service {
    const service: Constructor<Service> = config.service;
    const injectablesWithMocks = MocksManager.create(injectables, config.mocks);
    if (!injectablesWithMocks.has(FastifyInstanceToken)) {
        injectablesWithMocks.set(FastifyInstanceToken, wrapInjectable(fastify()));
    }

    isInjectable(service);
    const instance = service[CREATOR].register<Service>(injectablesWithMocks, false);

    let promise: Promise<unknown> | null = null;

    return new Proxy(instance, {
        get<T>(target: T, p: keyof T | 'then' | 'catch' | 'finally') {
            if (p === 'then' || p === 'catch' || p === 'finally') {
                if (promise == null) promise = hasAsyncInitializer(service)
                    ? readyMap.get(service)!.then(() => target)
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
