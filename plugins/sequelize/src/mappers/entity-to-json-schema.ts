/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import type { FastifyInstance } from 'fastify';
import type { JSONSchema7TypeName } from 'json-schema';
import type { DataType, Model, ModelAttributeColumnOptions, ModelCtor } from 'sequelize';
import type { JSONSchema7Extended } from '../types/json-schema.js';

const registeredSchemas = new Map<typeof Model, EntitySchema>();

export interface EntitySchema {
  definitionId: string;
  primaryKey: string;
  properties: Record<string, JSONSchema7Extended>;
  model: ModelCtor<Model>;
}

export function entityMetadataMapper(instance: FastifyInstance, model: typeof Model): EntitySchema {
  const definitionId = `/models/${model.getTableName()}`;
  if (instance.getSchema(definitionId)) return registeredSchemas.get(model)!;

  const properties: Record<string, JSONSchema7Extended> = {};

  const referencedEntries: Record<string, EntitySchema> = {};

  const entitySchema = {
    definitionId,
    primaryKey: '',
    properties,
    model: model,
  } as EntitySchema;

  for (const [name, description] of Object.entries(model.rawAttributes)) {
    const referencedColumn = model.sequelize?.modelManager.getModel(description.references);
    if (referencedColumn && !registeredSchemas.has(referencedColumn)) {
      referencedEntries[name] = entityMetadataMapper(instance, referencedColumn);
    }

    const property: Record<string, unknown> = {
      ...(referencedColumn ? referencedColumnMetadataMapper(referencedColumn) : columnMetadataMapper(description)),
    };
    if (description.primaryKey) entitySchema.primaryKey = name;

    properties[name] = property;
  }

  instance.addSchema({
    $id: definitionId,
    $schema: 'http://json-schema.org/draft-07/schema#',
    definitions: {
      entity: {
        type: 'object',
        properties,
      },
    },
  });
  registeredSchemas.set(model, entitySchema);

  return entitySchema;
}

function columnTypeMapper(type: DataType): { type: JSONSchema7TypeName; format?: 'date-time' } {
  if (typeof type === 'string') return { type } as { type: JSONSchema7TypeName };

  const key = type.key.toLowerCase();
  if (['date', 'timestamp'].includes(key)) return { type: 'string', format: 'date-time' };
  return { type: key } as { type: JSONSchema7TypeName };
}

function referencedColumnMetadataMapper(model: typeof Model): JSONSchema7Extended {
  return {
    oneOf: [
      {
        $ref: `/models/${model.getTableName()}#/definitions/entity`,
      },
      {
        type: 'null',
      },
    ],
  };
}

function columnMetadataMapper(columnMetadata: ModelAttributeColumnOptions): JSONSchema7Extended {
  const isNullable = columnMetadata.allowNull ?? false;
  const comment = columnMetadata.comment;
  const values = columnMetadata.values;
  const defaultValue = columnMetadata.defaultValue as any;
  const isGenerated = columnMetadata.autoIncrement || columnMetadata.autoIncrementIdentity || typeof defaultValue === 'function';
  const maxLength = columnMetadata.validate?.max;

  const { type, format } = columnTypeMapper(columnMetadata.type);
  return {
    type: type,
    ...(comment && { description: comment }),
    ...(typeof maxLength === 'number' && { maxLength: maxLength }),
    ...(typeof defaultValue !== 'function' && { default: defaultValue }),
    ...(values && { enum: [...values] }),
    ...(format && { format }),
    nullable: isNullable,

    // custom schema options
    _options: {
      generated: isGenerated,
    },
  };
}
