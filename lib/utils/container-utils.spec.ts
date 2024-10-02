import { Container } from '../registry/container.js';
import { getContainer } from './container-utils.js';

describe('Utils: getContainer', () => {
  it('should create and return container', () => {
    const metadata = {};
    const key = 'key';

    const result = getContainer(metadata, key);

    expect(result).toBeInstanceOf(Container);
    expect(result).toBe(metadata[key as keyof typeof metadata]);
  });

  it('should return same instance when called multiple times', () => {
    const metadata = {};
    const key = 'key';

    const firstCall = getContainer(metadata, key);
    const secondCall = getContainer(metadata, key);

    expect(firstCall).toBe(secondCall);
    expect(firstCall).toBe(metadata[key as keyof typeof metadata]);
  });
});
