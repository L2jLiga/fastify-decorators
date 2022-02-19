/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import type { FastifySchema } from 'fastify';
import { addHandler, decorateController } from 'fastify-decorators/plugins';
import type { Connection, ObjectType } from 'typeorm';
import { entityMetadataMapper } from '../mappers/entity-to-json-schema';
import { mergeRef, modifiableProperties, multiAffectedResponse, singleAffectedResponse } from '../mappers/schema-properties';
import type { JSONSchema7Extended } from '../types/json-schema';
import { entityHandlersFactory } from './entity-handlers-factory';

export function EntityController<Entity>(entity: ObjectType<Entity>): ClassDecorator {
  return decorateController('/', (target, instance) => {
    // @ts-expect-error we should have an TypeORM connection inside instance
    const connection = instance.connection as Connection;

    const entitySchema = entityMetadataMapper(instance, connection.getMetadata(entity));

    Object.defineProperties(target.prototype, entityHandlersFactory(entitySchema));

    const routesSchemas = baseSchema(entitySchema.definitionId, entitySchema.properties);

    addHandler(target, {
      url: '/',
      method: 'get',
      handlerMethod: 'findAll',
      options: {
        schema: routesSchemas.find,
      },
    });
  });
}

const sortingEnum = ['ASC', 'DESC', 'asc', 'desc'];

export const baseSchema = (schemaId: string, properties: Record<string, JSONSchema7Extended>): Record<string, FastifySchema> => ({
  find: {
    querystring: {
      $select: {
        oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
      },
      $sort: {
        oneOf: [
          { type: 'string', enum: sortingEnum },
          { type: 'array', items: { type: 'string' } },
          {
            type: 'object',
            properties: Object.keys(properties)
              .filter((key) => !properties[key].writeOnly && !properties[key]._options?.hidden)
              .reduce(
                (acc, key) => ({
                  ...acc,
                  [key]: { type: 'string', enum: sortingEnum },
                }),
                {},
              ),
          },
        ],
      },
      $limit: { type: 'number' },
      $skip: { type: 'number' },
      $where: { $ref: `${schemaId}#/definitions/query` },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          total: { type: 'number' },
          limit: { type: 'number' },
          skip: { type: 'number' },
          data: {
            type: 'array',
            items: {
              $ref: `${schemaId}#/definitions/entity`,
            },
          },
        },
      },
    },
  },
  findOne: {
    params: {
      id: { oneOf: [{ type: 'number' }, { type: 'string' }] },
    },
    querystring: {
      $results: { type: 'boolean' },
    },
    response: {
      200: { $ref: `${schemaId}#/definitions/entity` },
    },
  },
  create: {
    querystring: {
      $results: { type: 'boolean' },
    },
    body: {
      oneOf: [
        { type: 'array', items: { $ref: `${schemaId}#/definitions/entity` } },
        { type: 'object', $ref: `${schemaId}#/definitions/entity` },
      ],
    },
    response: {
      // Not possible to support a few types. The issue: https://github.com/fastify/fast-json-stringify/issues/193
      200: {
        type: 'array',
        items: {
          oneOf: [{ type: 'number' }, { type: 'object', $ref: `${schemaId}#/definitions/entity` }],
        },
      },
    },
  },
  patch: {
    querystring: mergeRef(`${schemaId}#/definitions/query`, { $results: { type: 'boolean' } }),
    body: {
      type: 'object',
      properties: modifiableProperties(schemaId, properties),
    },
    response: {
      200: multiAffectedResponse(`${schemaId}#/definitions/entity`),
    },
  },
  patchOne: {
    params: {
      id: { oneOf: [{ type: 'number' }, { type: 'string' }] },
    },
    querystring: {
      $results: { type: 'boolean' },
    },
    body: {
      type: 'object',
      properties: modifiableProperties(schemaId, properties),
    },
    response: {
      200: singleAffectedResponse(`${schemaId}#/definitions/entity`),
    },
  },
  update: {
    querystring: mergeRef(`${schemaId}#/definitions/query`, { $results: { type: 'boolean' } }),
    body: {
      $ref: `${schemaId}#/definitions/entity`,
    },
    response: {
      200: multiAffectedResponse(`${schemaId}#/definitions/entity`),
    },
  },
  updateOne: {
    params: {
      id: { oneOf: [{ type: 'number' }, { type: 'string' }] },
    },
    querystring: {
      $results: { type: 'boolean' },
    },
    body: {
      $ref: `${schemaId}#/definitions/entity`,
    },
    response: {
      200: singleAffectedResponse(`${schemaId}#/definitions/entity`),
    },
  },
  remove: {
    querystring: mergeRef(`${schemaId}#/definitions/query`, { $results: { type: 'boolean' } }),
    response: {
      200: multiAffectedResponse(`${schemaId}#/definitions/entity`),
    },
  },
  removeOne: {
    params: {
      id: { oneOf: [{ type: 'number' }, { type: 'string' }] },
    },
    querystring: {
      $results: { type: 'boolean' },
    },
    response: {
      200: singleAffectedResponse(`${schemaId}#/definitions/entity`),
    },
  },
});
