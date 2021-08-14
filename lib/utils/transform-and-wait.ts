export const transformAndWait = async <Item>(collection: Iterable<Item>, mapFn: (arg: Item) => unknown | Promise<unknown>): Promise<void> => {
  await Promise.all([...collection].map(mapFn));
};
