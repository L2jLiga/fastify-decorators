export const transformAndWait = async <Item>(
  collection: Iterable<Item> | AsyncIterable<Item>,
  mapFn: (arg: Item) => unknown | Promise<unknown>,
): Promise<void> => {
  for await (const item of collection) {
    await mapFn(item);
  }
};
