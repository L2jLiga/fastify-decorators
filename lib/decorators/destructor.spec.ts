import { Destructor, servicesWithDestructors } from './destructor.js';

describe('Decorator: destructor', () => {
  afterEach(() => servicesWithDestructors.clear());

  it('should add service method to destructors map', () => {
    class Foo {
      @Destructor()
      bar() {
        /* body */
      }
    }

    expect(servicesWithDestructors.size).toBe(1);
    expect(servicesWithDestructors.get(Foo)).toBe('bar');
  });
});
