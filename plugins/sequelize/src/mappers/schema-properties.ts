/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { JSONSchema7Extended } from '../types/json-schema';

export function modifiableProperties(
  schemaId: string,
  properties: Record<string, JSONSchema7Extended>,
): Record<string, JSONSchema7Extended> {
  return Object.keys(properties)
    .filter((key) => !properties[key]._options?.hidden && !properties[key].readOnly)
    .reduce(
      (props, key) => ({
        ...props,
        [key]: { $ref: `${schemaId}#/definitions/entity/properties/${key}` },
      }),
      {} as Record<string, JSONSchema7Extended>,
    );
}
