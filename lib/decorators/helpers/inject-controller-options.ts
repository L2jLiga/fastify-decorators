/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { Registrable } from '../../plugins/index.js';
import { CREATOR } from '../../symbols/index.js';

export function injectControllerOptions(controller: unknown): asserts controller is Registrable {
  if (controller instanceof Function) {
    if (!(CREATOR in controller)) {
      Object.defineProperty(controller, CREATOR, { value: {} });
    }

    return;
  }

  throw new Error('Invalid usage of @Controller decorator');
}
