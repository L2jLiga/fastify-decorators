/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import type { JSONSchema7 } from 'json-schema';

export interface JSONSchema7Extended extends JSONSchema7 {
  nullable?: boolean;
  _options?: {
    generated?: boolean;
    hidden?: boolean;
  };
}
