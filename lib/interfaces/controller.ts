import type { RouteShorthandOptions } from 'fastify';
import type { HttpMethods } from './http-methods.js';

export interface IHandler {
  url: string;
  method: HttpMethods;
  options: RouteShorthandOptions;
  handlerMethod: string | symbol;
}

export interface IErrorHandler {
  accepts<T extends Error>(error?: T): boolean;

  handlerName: string | symbol;
}

export interface IHook {
  name: string;
  handlerName: string | symbol;
}
