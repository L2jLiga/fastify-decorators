export type Constructable<T> = { new (): T } | { new (...args: any): T };
