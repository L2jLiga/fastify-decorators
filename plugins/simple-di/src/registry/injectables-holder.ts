import { _injectablesHolder } from './_injectables-holder.js';

/**
 * Object holding user provided and automatically generated tokens.
 *
 * This holder can be used in order to overwrite or add more tokens
 * which will be used for dependency injection later
 */
export interface InjectablesHolder {
  /**
   * Injects class annotated with `@Service` decorator.
   * This class will be instantiated on demand when token requested.
   *
   * @param token - unique identifier for service, can be service class itself
   * @param service - class to instantiate when token requested
   */
  injectService(token: unknown, service: unknown): void;

  /**
   * Injects singleton object, number or anything else.
   *
   * When token requested, DI will just return this value
   *
   * @param token - unique identifier for object/singleton
   * @param singleton - object to return when token requested
   */
  injectSingleton(token: unknown, singleton: unknown): void;
}

export const injectablesHolder: InjectablesHolder = _injectablesHolder as InjectablesHolder;
