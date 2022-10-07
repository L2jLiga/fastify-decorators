import { Constructable, CREATOR, Registrable } from '../plugins/index.js';

export function isValidRegistrable<T = unknown>(constructable: Constructable<T>): constructable is Registrable<T> {
  return constructable && CREATOR in constructable;
}
