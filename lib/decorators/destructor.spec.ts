import { destructors } from '../registry/destructors.js';
import { DESTRUCTOR } from '../symbols/index.js';
import { Destructor } from './destructor.js';

describe('Decorator: destructor', () => {
  afterEach(() => destructors.clear());

  it('should decorate service with Destructor symbol', () => {
    class Foo {
      @Destructor()
      bar() {
        /* body */
      }
    }

    // @ts-expect-error TypeScript does not know about mutations within decorators
    expect(Foo[DESTRUCTOR]).toBe('bar');
  });
});
