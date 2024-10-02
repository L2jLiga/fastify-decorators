/**
 * Interface to provide mock for services
 * @public
 */
export interface ServiceMock<T = unknown> {
  /**
   * Unique identifier for service to provide
   */
  provide: string | symbol | Record<string | symbol | number, unknown> | object;
  /**
   * Exact value to provide when token requested
   */
  useValue: Record<string | symbol | number, unknown> | T;
}
