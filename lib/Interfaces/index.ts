/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */
import { Constructor,DepScopeHelper } from '../Decorators/Helpers/index.js';


export type { IErrorHandler, IHandler, IHook } from './controller.js';
export type { InjectableController } from './injectable-class.js';
export { RequestHandler, RequestHook } from './request-handler.js';

export type ClassLoader = <C>(constructor: Constructor<C>, scope?: DepScopeHelper.DependencyScope) => C;

export type HttpMethod = "post" | "get" | "patch" | "put" | "delete" | "options" | "head" | "all";
