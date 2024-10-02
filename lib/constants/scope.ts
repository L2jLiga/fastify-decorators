/**
 * Scope within which class instance exists
 */
export const enum Scope {
  /**
   * Once and forever
   */
  SINGLETON,

  /**
   * Created per each request
   */
  PER_REQUEST,
}
