/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { Constructor } from '../decorators/helpers/inject-dependencies';
import { Injectables } from '../interfaces/injectable-class';
import { injectables } from '../registry/injectables';
import { CREATOR } from '../symbols';
import { MocksManager } from './mocks-manager';
import { ServiceMock } from './service-mock';

export interface ServiceTestConfig<Service> {
    service: Constructor<Service>;
    mocks?: ServiceMock[];
}

export function configureServiceTest<Service>(config: ServiceTestConfig<Service>): Service {
    const service: Constructor<Service> = config.service;
    const injectablesWithMocks = MocksManager.create(injectables, config.mocks);

    isInjectable(service);
    return service[CREATOR].register(injectablesWithMocks, false);
}

function isInjectable<Service>(service: Constructor<Service>): asserts service is Constructor<Service> & { [CREATOR]: { register(injectables: Injectables, useOriginal: boolean): Service } } {
    if (!(CREATOR in service)) {
        throw new Error('Provided service does not annotated with @Service!');
    }
}
