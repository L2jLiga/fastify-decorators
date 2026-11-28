export interface ServiceMock {
  provide: string | symbol | Record<string | symbol | number, any>;
  useValue: Record<string | symbol | number, unknown>;
}
