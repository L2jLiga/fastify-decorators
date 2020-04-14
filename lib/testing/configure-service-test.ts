/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { Constructor } from '../decorators/helpers/inject-dependencies';
import { injectables } from '../registry/injectables';
import { CREATOR } from '../symbols';
import { MocksManager } from './mocks-manager';
import { ServiceMock } from './service-mock';

export interface ServiceTestConfig<Service> {
    service: Constructor<Service>;
    mocks?: ServiceMock[];
}

export function configureServiceTest<Service>(config: ServiceTestConfig<Service>): Service {
    const service: any = config.service;
    const injectablesWithMocks = MocksManager.create(injectables, config.mocks);

    return service[CREATOR].register(injectablesWithMocks, false);
}
