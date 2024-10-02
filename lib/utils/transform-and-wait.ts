/**
 * Consecutively executes callback function for each item of collection.
 * If callback is async function then it waits for Promise resolve before
 * continue with next element.
 *
 * @param collection - Array, Map, Set, sync or async generators
 * @param mapFn - callback function to apply on each element
 * @returns Promise, resolved once iteration done
 */
export const transformAndWait = async <Item>(
  collection: Iterable<Item> | AsyncIterable<Item>,
  mapFn: (arg: Item) => unknown | Promise<unknown>,
): Promise<void> => {
  for await (const item of collection) {
    await mapFn(item);
  }
};
