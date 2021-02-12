/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { ColumnType, EntityMetadata, ObjectLiteral, Repository } from 'typeorm';
import { FastifyInstance } from 'fastify';
import { JSONSchema7Extended } from '../types/json-schema';
import { JSONSchema7TypeName } from 'json-schema';

const registeredSchemas = new Map<EntityMetadata, EntitySchema>();

export interface EntitySchema {
  definitionId: string;
  primaryKey: string;
  properties: Record<string, JSONSchema7Extended>;
  repository: Repository<ObjectLiteral>;
  save(value: ObjectLiteral): Promise<ObjectLiteral>;
}

export function entityMetadataMapper(instance: FastifyInstance, metadata: EntityMetadata): EntitySchema {
  const definitionId = `/models/${metadata.name}`;
  if (instance.getSchema(definitionId)) return registeredSchemas.get(metadata)!;

  const properties: Record<string, JSONSchema7Extended> = {};

  const referencedEntries: Record<string, EntitySchema> = {};

  const entitySchema = {
    definitionId,
    primaryKey: '',
    properties,
    repository: metadata.connection.getRepository(metadata.target),
    async save(value: ObjectLiteral) {
      for (const [key, entrySchema] of Object.entries(referencedEntries)) {
        if (!value[key]) continue;
        value[key] = await entrySchema.save(value[key]);
      }
      return this.repository.save(value);
    },
  } as EntitySchema;

  for (const column of metadata.columns) {
    const referencedColumn = column.referencedColumn?.entityMetadata;
    if (referencedColumn && !registeredSchemas.has(referencedColumn)) {
      referencedEntries[column.propertyName] = entityMetadataMapper(instance, referencedColumn);
    }

    const property: Record<string, unknown> = {
      ...(referencedColumn ? referencedColumnMetadataMapper(referencedColumn) : columnMetadataMapper(column)),
    };
    if (column.isPrimary) entitySchema.primaryKey = column.propertyName;

    properties[column.propertyName] = property;
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
  registeredSchemas.set(metadata, entitySchema);

  return entitySchema;
}

function columnTypeMapper(type: ColumnType): JSONSchema7TypeName {
  if (typeof type === 'function') {
    if (type === Number) return 'number';
    if (type === String) return 'string';
    if (type === Boolean) return 'boolean';
  }

  return type as JSONSchema7TypeName;
}

type ColumnMetadata = EntityMetadata['columns'][0];

function referencedColumnMetadataMapper({ name }: EntityMetadata): JSONSchema7Extended {
  return {
    oneOf: [
      {
        $ref: `/models/${name}#/definitions/entity`,
      },
      {
        type: 'null',
      },
    ],
  };
}

function columnMetadataMapper(columnMetadata: ColumnMetadata): JSONSchema7Extended {
  const { length, comment, propertyName, isNullable, isSelect, isUpdate, isGenerated } = columnMetadata;

  return {
    type: columnTypeMapper(columnMetadata.type),
    ...(propertyName && { title: propertyName }),
    ...(comment && { description: comment }),
    ...(length && { maxLength: parseInt(length, 10) }),
    ...(typeof columnMetadata.default !== 'function' && { default: columnMetadata.default }),
    ...(columnMetadata.enum && { enum: columnMetadata.enum }),
    ...(['timestamp', 'date'].includes(columnMetadata.type as string) && { format: 'date-time' }),
    readOnly: isSelect && !isUpdate,
    writeOnly: !isSelect && isUpdate,
    nullable: isNullable,

    // custom schema options
    _options: {
      generated: typeof columnMetadata.default === 'function' || isGenerated,
      hidden: !isSelect,
    },
  };
}
