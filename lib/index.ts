/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

export { bootstrap } from './bootstrap/bootstrap.js';
export { BootstrapConfig } from './interfaces/bootstrap-config.js';
export { RequestHandler } from './interfaces/request-handler.js';

export * from './decorators';
export { ControllerType } from './registry/controller-type.js';
export { ControllerConfig } from './interfaces/controller-config.js';

export { Destructor } from './decorators/destructor.js';

export { injectablesHolder } from './registry/injectables-holder.js';
export { getInstanceByToken } from './utils/get-instance-by-token.js';
export { FastifyInstanceToken, FastifyRequestToken, FastifyReplyToken } from './symbols/index.js';

export { RouteConfig } from './interfaces/route-config.js';
