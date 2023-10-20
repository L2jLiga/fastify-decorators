import { Constructable, Registrable } from '../plugins/index.js';
import { CREATOR } from '../symbols/index.js';

export function isValidRegistrable<T = unknown>(constructable: Constructable<T>): constructable is Registrable<T> {
  return constructable && CREATOR in constructable;
}
