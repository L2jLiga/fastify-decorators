export interface ErrorHandlerDefinition {
  accepts: (error: Error) => boolean;
  handlerName: PropertyKey;
}
