/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import type { InjectableService } from '../interfaces/injectable-class.js';
import { CREATOR } from 'fastify-decorators/plugins';

export function wrapInjectable<T>(object: T): InjectableService {
  return {
    [CREATOR]: {
      register() {
        return object;
      },
    },
  } as unknown as InjectableService;
}
