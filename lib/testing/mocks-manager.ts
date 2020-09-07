/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { Injectables, InjectableService } from '../interfaces/injectable-class';
import { wrapInjectable } from '../utils/wrap-injectable';
import { ServiceMock } from './service-mock';

export class MocksManager {
    static create(injectables: Injectables, mocks: ServiceMock[] = []): Injectables {
        const mocksMap: Injectables = new Map(mocks.map(mock => [mock.provide, wrapInjectable(mock.useValue)]));

        for (const [key, value] of injectables.entries()) {
            const mock = mocksMap.has(value) ? <InjectableService>mocksMap.get(value) : value;

            mocksMap.set(key, mock);
        }

        return mocksMap;
    }
}
