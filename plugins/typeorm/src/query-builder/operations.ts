/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

export type OperationFn = (key: string, value: string | string[]) => [string, Record<string, string | string[]>];

// TODO: handle those ones for PostgreSQL only
// $iRegexp: '~*',
// $notIRegexp: '!~*',
// $contains: '@>',
// $containsKey: '?',
// $contained: '<@',
// $any: '?|',
// $all: '?&'

const operations: Record<string, OperationFn> = {
  $eq: (k, v) => [`${k} = :${k}`, { [k]: v }],
  $neq: (k, v) => [`${k} != :${k}`, { [k]: v }],
  $gt: (k, v) => [`${k} > :${k}`, { [k]: v }],
  $gte: (k, v) => [`${k} >= :${k}`, { [k]: v }],
  $lt: (k, v) => [`${k} < :${k}`, { [k]: v }],
  $lte: (k, v) => [`${k} <= :${k}`, { [k]: v }],
  $like: (k, v) => [`${k} LIKE :${k}`, { [k]: v }],
  $nlike: (k, v) => [`${k} NOT LIKE :${k}`, { [k]: v }],
  $ilike: (k, v) => [`${k} ILIKE :${k}`, { [k]: v }],
  $nilike: (k, v) => [`${k} NOT ILIKE :${k}`, { [k]: v }],
  $regex: (k, v) => [`${k} ~ :${k}`, { [k]: v }],
  $nregex: (k, v) => [`${k} !~ :${k}`, { [k]: v }],
  $in: (k, v) => [`${k} IN (:...${k})`, { [k]: Array.isArray(v) ? v : [v] }],
  $nin: (k, v) => [`${k} NOT IN (:...${k})`, { [k]: Array.isArray(v) ? v : [v] }],
  $between: (k, v) => [`${k} BETWEEN :${k}_from AND :${k}_to`, { [`${k}_from`]: v[0], [`${k}_to`]: v[1] }],
  $nbetween: (k, v) => [`${k} NOT BETWEEN :${k}_from AND :${k}_to`, { [`${k}_from`]: v[0], [`${k}_to`]: v[1] }],
};

export default operations;
