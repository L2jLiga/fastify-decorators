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
          oneOf: [
            { type: 'string' },
            { type: 'number' },
            {
              type: 'object',
              properties: queryProperties(
                property.type && ['string', 'number'].includes(property.type.toString()) ? (property.type as 'string' | 'number') : ['number', 'string'],
              ),
            },
          ],
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
  const typeDef: JSONSchema7 = Array.isArray(type) ? { anyOf: [{ type: 'number' }, { type: 'string' }] } : { type };

  return {
    $eq: typeDef,
    $neq: typeDef,
    $gt: typeDef,
    $gte: typeDef,
    $lt: typeDef,
    $lte: typeDef,
    $like: { type: 'string' },
    $nlike: { type: 'string' },
    $ilike: { type: 'string' },
    $nilike: { type: 'string' },
    $regex: { type: 'string' },
    $nregex: { type: 'string' },
    $in: { type: 'array', items: typeDef },
    $nin: { type: 'array', items: typeDef },
    $between: { type: 'array', items: [typeDef, typeDef] },
    $nbetween: { type: 'array', items: [typeDef, typeDef] },
  };
}
