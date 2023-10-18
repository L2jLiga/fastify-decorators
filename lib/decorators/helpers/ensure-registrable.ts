/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { Registrable } from '../../plugins/index.js';
import { CREATOR } from '../../symbols/index.js';

export function ensureRegistrable<OriginalType = unknown, CastAs = unknown>(target: OriginalType): asserts target is OriginalType & Registrable<CastAs> {
  if (target instanceof Function) {
    if (!(CREATOR in target) || target[CREATOR] == null) {
      Object.defineProperty(target, CREATOR, { value: {} });
    }

    return;
  }

  throw new Error('Invalid usage of @Controller decorator');
}
