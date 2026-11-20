import { destructors } from '../../registry/destructors.js';
import { DESTRUCTOR } from '../../Symbols/index.js';
import { Destructor } from './Destructor.js';

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
