/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import type { JSONSchema7, JSONSchema7Definition } from 'json-schema';
import type { JSONSchema7Extended } from '../types/json-schema.js';

export function modifiableProperties(schemaId: string, properties: Record<string, JSONSchema7Extended>): Record<string, JSONSchema7Extended> {
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

export function mergeRef($ref: string, properties: Record<string, JSONSchema7Definition>): JSONSchema7 {
  return {
    type: 'object',
    allOf: [{ $ref }, { properties }],
  };
}

export function multiAffectedResponse($ref: string): JSONSchema7 {
  return {
    type: 'object',
    properties: {
      affected: { type: 'number' },
      data: {
        type: 'array',
        items: { $ref },
      },
    },
  };
}

export function singleAffectedResponse($ref: string): JSONSchema7 {
  const properties: Record<string, JSONSchema7> = { affected: { type: 'number' } };
  return {
    type: 'object',
    properties,
    if: { not: { properties } },
    then: { $ref },
  };
}
