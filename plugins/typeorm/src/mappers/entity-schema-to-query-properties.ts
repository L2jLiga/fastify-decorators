/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import type { JSONSchema7 } from 'json-schema';
import type { JSONSchema7Extended } from '../types/json-schema.js';

export function entitySchemaToQueryProperties(properties: Record<string, JSONSchema7Extended>): Record<string, JSONSchema7Extended> {
  return Object.entries(properties)
    .filter(([, property]) => !property.writeOnly && !property._options?.hidden)
    .reduce(
      (acc, [key, property]) => ({
        ...acc,
        [key]: {
          type: ['string', 'number', 'object'],
          properties: queryProperties(
            property.type && ['string', 'number'].includes(property.type.toString()) ? (property.type as 'string' | 'number') : ['number', 'string'],
          ),
        },
      }),
      {
        $or: {
          type: 'array',
          items: { $ref: `#/definitions/query` },
        },
      },
    );
}

function queryProperties(type: 'number' | 'string' | ['number', 'string']): Record<string, JSONSchema7> {
  return {
    $eq: { type },
    $neq: { type },
    $gt: { type },
    $gte: { type },
    $lt: { type },
    $lte: { type },
    $like: { type: 'string' },
    $nlike: { type: 'string' },
    $ilike: { type: 'string' },
    $nilike: { type: 'string' },
    $regex: { type: 'string' },
    $nregex: { type: 'string' },
    $in: { type: 'array', items: { type } },
    $nin: { type: 'array', items: { type } },
    $between: { type: 'array', items: [{ type }, { type }] },
    $nbetween: { type: 'array', items: [{ type }, { type }] },
  };
}
