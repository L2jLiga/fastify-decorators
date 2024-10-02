import { transformAndWait } from './transform-and-wait.js';

describe('Utils: transformAndWait', () => {
  it('should work with arrays', async () => {
    const input = [1, 3, 5];
    const mapFn = (item: number) => (result = `${result}${item}`);

    let result = '';
    await transformAndWait(input, mapFn);

    expect(result).toBe('135');
  });

  it('should work with maps', async () => {
    const input = new Map<number, number>([
      [1, 2],
      [3, 4],
    ]);
    const mapFn = ([key, value]: [number, number]) => (result[key] = value);

    const result = {} as Record<number, number>;
    await transformAndWait(input, mapFn);

    expect(result).toEqual({ 1: 2, 3: 4 });
  });

  it('should work with sets', async () => {
    const input = new Set<number>([1, 2, 3, 4]);
    const mapFn = (value: number) => result.push(value);

    const result = [] as number[];
    await transformAndWait(input, mapFn);

    expect(result).toEqual([1, 2, 3, 4]);
  });

  it('should work with generators', async () => {
    function* input() {
      yield [1, 2] as [number, number];
      yield [3, 4] as [number, number];
    }
    const mapFn = ([key, value]: [number, number]) => (result[key] = value);

    const result = {} as Record<number, number>;
    await transformAndWait(input(), mapFn);

    expect(result).toEqual({ 1: 2, 3: 4 });
  });

  it('should work with async generators', async () => {
    async function* input() {
      await Promise.resolve();
      yield [1, 2] as [number, number];
      await new Promise((resolve) => setTimeout(resolve, 20));
      yield [3, 4] as [number, number];
    }
    const mapFn = ([key, value]: [number, number]) => (result[key] = value);

    const result = {} as Record<number, number>;
    await transformAndWait(input(), mapFn);

    expect(result).toEqual({ 1: 2, 3: 4 });
  });

  it('should work with custom iterators', async () => {
    const input = {
      *[Symbol.iterator]() {
        yield [1, 2] as [number, number];
        yield [3, 4] as [number, number];
      },
    };
    const mapFn = ([key, value]: [number, number]) => (result[key] = value);

    const result = {} as Record<number, number>;
    await transformAndWait(input, mapFn);

    expect(result).toEqual({ 1: 2, 3: 4 });
  });

  it('should work with custom async iterators', async () => {
    const input = {
      async *[Symbol.asyncIterator]() {
        yield [1, 2] as [number, number];
        await new Promise((resolve) => setTimeout(resolve, 20));
        yield [3, 4] as [number, number];
      },
    };
    const mapFn = ([key, value]: [number, number]) => (result[key] = value);

    const result = {} as Record<number, number>;
    await transformAndWait(input, mapFn);

    expect(result).toEqual({ 1: 2, 3: 4 });
  });
});
