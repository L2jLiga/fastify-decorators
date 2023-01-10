import { Constructable, CREATOR } from '../plugins/index.js';
import { isValidRegistrable } from './validators.js';

describe('Utils: validators', () => {
  describe('is valid registrable', () => {
    it('should return false when class has no CREATOR property', () => {
      class TestClass {}

      const result = isValidRegistrable(TestClass);

      expect(result).toBeFalsy();
    });

    it('should return false when null given', () => {
      expect(isValidRegistrable(null as unknown as Constructable)).toBeFalsy();
    });

    it('should return true when CREATER in target', () => {
      class TestClass {
        static [CREATOR] = {};
      }

      const result = isValidRegistrable(TestClass);

      expect(result).toBeTruthy();
    });
  });
});
