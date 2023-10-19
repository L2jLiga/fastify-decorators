/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

export * from './class-loader.js';
export * from './life-cycle.js';
export { Constructable, Registrable } from './shared-interfaces.js';

export { hasHooks, hasHandlers, hasErrorHandlers } from '../decorators/helpers/class-properties.js';
export { ensureHooks, ensureHandlers, ensureErrorHandlers } from '../decorators/helpers/class-properties.js';
export { IHook, IHandler, IErrorHandler } from '../interfaces/controller.js';
export { HOOKS, ERROR_HANDLERS, HANDLERS, CREATOR } from '../symbols/index.js';

export { Container } from '../decorators/helpers/container.js';
export { CLASS_LOADER } from './class-loader.js';
