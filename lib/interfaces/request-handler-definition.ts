import { HTTPMethods, RouteShorthandOptions } from 'fastify';

export interface RequestHandlerDefinition {
  url: string;
  method: Lowercase<HTTPMethods> | 'all';
  options: RouteShorthandOptions;
  handlerName: PropertyKey;
}
