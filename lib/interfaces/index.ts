/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */
import { Constructor } from '../Decorators/Helpers/inject-dependencies.js';
import { DependencyScope } from '../Decorators/Helpers/dependency-scope.js';


export type { IErrorHandler, IHandler, IHook } from './controller.js';
export { HttpMethods } from './http-methods.js';
export type { InjectableController } from './injectable-class.js';
export { RequestHandler, RequestHook } from './request-handler.js';
export type { RouteConfig } from './route-config.js';

export type ClassLoader = <C>(constructor: Constructor<C>, scope?: DependencyScope) => C;
