/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import type { ObjectLiteral, Repository, SelectQueryBuilder, WhereExpressionBuilder } from 'typeorm';
import { Brackets } from 'typeorm';
import operations from './operations.js';

export interface FindQuery {
  $limit?: number;
  $skip?: number;
  $select?: string[];
  $sort?: string | string[];
  $where?: WhereQuery;
}

export interface WhereQuery {
  $or?: WhereQuery[];

  [key: string]: any;
}

type WhereOperator = 'andWhere' | 'orWhere' | 'where';
type WhereFn<E> = SelectQueryBuilder<E>['where'] | SelectQueryBuilder<E>['andWhere'] | SelectQueryBuilder<E>['orWhere'];

export const whereBuilder = <E>(_query: SelectQueryBuilder<E> | WhereExpressionBuilder, _where: WhereQuery): void => {
  let isWhereUsed: string | null = null;
  const getWhere = (prefix: 'and' | 'or' = 'and'): WhereOperator => (isWhereUsed ? (`${prefix}Where` as 'andWhere' | 'orWhere') : (isWhereUsed = 'where'));
  const andWhere = ((where: string, params: ObjectLiteral) => _query[getWhere()](where, params)) as WhereFn<E>;

  Object.entries(_where)
    .filter(([key]) => key[0] !== '$')
    .forEach(([key, value]) => {
      if (typeof value === 'object') {
        Object.entries(value).forEach(([k, v]) => {
          andWhere(...operations[k](key, v as string | string[]));
        });
      } else {
        andWhere(...operations['$eq'](key, value));
      }
    });

  if (_where.$or) {
    const or = _where.$or;
    andWhere(
      new Brackets((qb) => {
        isWhereUsed = null;
        or.forEach((nestedWhere) => {
          qb[getWhere('or')](
            new Brackets((factory) => {
              whereBuilder(factory, nestedWhere);
            }),
          );
        });
      }),
    );
  }
};

export const createSelectQueryBuilder = <E>(repository: Repository<E>, query: FindQuery = {}): SelectQueryBuilder<E> => {
  const _query = repository.createQueryBuilder('entity');

  if (query.$select) {
    const select = Array.isArray(query.$select) ? query.$select : [query.$select];
    _query.select(select.map((field) => `entity.${field}`));
  }

  if (query.$sort) {
    if (typeof query.$sort === 'string') {
      _query.orderBy(`entity.${query.$sort}`);
    } else if (Array.isArray(query.$sort)) {
      const orderOptions = query.$sort.reduce((acc, curr) => ({ ...acc, [`entity.${curr}`]: 'ASC' }), {});
      _query.orderBy(orderOptions);
    } else if (typeof query.$sort === 'object') {
      _query.orderBy(query.$sort);
    }
  }

  // Notes:
  // $or - always an array! Specify on json schema!!!
  // $where - is object
  if (query.$where) {
    whereBuilder(_query, query.$where);
  }

  if (query.$skip) {
    _query.skip(query.$skip);
  }

  if (query.$limit !== null) {
    _query.take(query.$limit || 20);
  }

  return _query;
};
