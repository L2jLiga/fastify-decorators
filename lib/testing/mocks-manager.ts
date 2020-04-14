/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { wrapInjectable } from '../utils/wrap-injectable';
import { ServiceMock } from './service-mock';

export class MocksManager {
    static create(injectables: Map<any, any>, mocks: ServiceMock[] = []): Map<any, any> {
        const injectablesWithMocks = new Map<any, any>(mocks.map(mock => [mock.provide, wrapInjectable(mock.useValue)]));

        for (const [key, value] of injectables.entries()) {
            const mock = mocks.find(({ provide }) => provide === value);

            if (mock) injectablesWithMocks.set(key, wrapInjectable(mock.useValue));
            else injectablesWithMocks.set(key, value);
        }

        return injectablesWithMocks;
    }
}
