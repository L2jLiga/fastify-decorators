/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import type { FastifyReply, FastifyRequest } from 'fastify';
import type { ObjectLiteral } from 'typeorm';
import type { EntitySchema } from '../mappers/entity-to-json-schema.js';
import type { FindQuery, WhereQuery } from '../query-builder/index.js';
import { createSelectQueryBuilder, whereBuilder } from '../query-builder/index.js';

export function entityHandlersFactory(entitySchema: EntitySchema): PropertyDescriptorMap {
  return {
    find: {
      async value(request: FastifyRequest<{ Querystring: FindQuery }>) {
        const [data, total] = await createSelectQueryBuilder(entitySchema.repository, request.query).getManyAndCount();

        return { data, total };
      },
    },
    findOne: {
      async value(request: FastifyRequest<{ Params: Record<typeof entitySchema.primaryKey, string | number> }>, reply: FastifyReply) {
        const result = await createSelectQueryBuilder(entitySchema.repository, {
          $where: { [entitySchema.primaryKey]: request.params.id },
        }).getOne();

        if (!result) {
          reply.status(204).send();
          return;
        }

        return result;
      },
    },
    create: {
      async value(request: FastifyRequest<{ Body: ObjectLiteral }>) {
        return entitySchema.repository.create(request.body);
      },
    },
    patch: {
      async value(request: FastifyRequest<{ Body: ObjectLiteral; Querystring: WhereQuery }>) {
        const _queryBuilder = entitySchema.repository.metadata.connection.createQueryBuilder().update(entitySchema.repository.target).set(request.body);

        whereBuilder(_queryBuilder, request.query);

        const [data, total] = await createSelectQueryBuilder(entitySchema.repository, {
          $where: request.query,
        }).getManyAndCount();

        return { data, total };
      },
    },
    patchOne: {
      async value(
        request: FastifyRequest<{
          Params: Record<typeof entitySchema.primaryKey, string | number>;
          Body: ObjectLiteral;
        }>,
        reply: FastifyReply,
      ) {
        await createSelectQueryBuilder(entitySchema.repository, {
          $where: { [entitySchema.primaryKey]: request.params.id },
        })
          .update(entitySchema.repository.target)
          .set(request.body)
          .execute();

        const result = await createSelectQueryBuilder(entitySchema.repository, {
          $where: { [entitySchema.primaryKey]: request.params.id },
        }).getOne();

        if (!result) {
          reply.status(204).send();
          return;
        }

        return result;
      },
    },
    update: {},
    updateOne: {},
    remove: {
      async value(request: FastifyRequest<{ Querystring: WhereQuery }>) {
        const query = entitySchema.repository.createQueryBuilder().delete();

        whereBuilder(query, request.query);

        const { affected } = await query.execute();

        return { affected };
      },
    },
    removeOne: {
      async value(request: FastifyRequest<{ Params: Record<typeof entitySchema.primaryKey, string | number> }>, reply: FastifyReply) {
        const query = entitySchema.repository.createQueryBuilder().delete();

        whereBuilder(query, { $where: { [entitySchema.primaryKey]: request.params.id } });

        await query.execute();

        reply.status(204).send();
      },
    },
  };
}
