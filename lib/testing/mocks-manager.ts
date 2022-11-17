/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { _InjectablesHolder } from '../registry/_injectables-holder.js';
import type { ServiceMock } from './service-mock.js';

export class MocksManager {
  static create(source: _InjectablesHolder, mocks: ServiceMock[] = []): _InjectablesHolder {
    const mocked = new _InjectablesHolder();
    mocked.autoGenerated = new Map(source.entries());

    for (const { provide, useValue } of mocks) {
      mocked.injectSingleton(provide, useValue);
    }

    return mocked;
  }
}
