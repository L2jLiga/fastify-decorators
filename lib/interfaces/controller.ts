/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

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
