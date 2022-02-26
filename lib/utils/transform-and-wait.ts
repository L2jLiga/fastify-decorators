/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

export const transformAndWait = async <Item>(
  collection: Iterable<Item> | AsyncIterable<Item>,
  mapFn: (arg: Item) => unknown | Promise<unknown>,
): Promise<void> => {
  const items: Item[] = [];
  for await (const item of collection) {
    items.push(item);
  }

  await Promise.all(items.map(mapFn));
};
