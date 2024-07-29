import { Container } from './container.js';

describe('Helpers: Container', () => {
  test('empty container should have 0 length', () => {
    const container = new Container();

    expect(container.length).toBe(0);
  });

  it('should return length equals to containers items count', () => {
    const container = new Container();

    container.push(1, 2, 3);

    expect(container.length).toBe(3);
  });

  it('should sum parent container length', () => {
    const parent = new Container();
    parent.push(34);
    const container = new Container(parent);
    container.push(43);

    expect(container.length).toBe(2);
  });

  it('should iterate over parent container elements first', () => {
    const parent = new Container();
    parent.push(34);
    const container = new Container(parent);
    container.push(43);

    expect([...container]).toEqual([34, 43]);
  });

  it('should dynamically change content when parent container updated', () => {
    const parent = new Container();
    parent.push(34);
    const container = new Container(parent);
    container.push(43);

    expect(container.length).toBe(2);
    expect([...container]).toEqual([34, 43]);

    parent.push(2);

    expect(container.length).toBe(3);
    expect([...container]).toEqual([34, 2, 43]);
  });
});
