/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

export { bootstrap } from './bootstrap/bootstrap.js';
export { BootstrapConfig } from './Interfaces/bootstrap-config.js';
export { RequestHandler } from './Interfaces/request-handler.js';

export * from './Decorators';
export { ControllerType } from './registry/controller-type.js';
export { ControllerConfig } from './Interfaces/controller-config.js';

export { Destructor } from './Decorators/Destructor/Destructor.js';

export { injectablesHolder } from './registry/injectables-holder.js';
export { getInstanceByToken } from './Utils/get-instance-by-token.js';
export { FastifyInstanceToken, FastifyRequestToken, FastifyReplyToken } from './Symbols/index.js';

export { RouteConfig } from './Interfaces/route-config.js';
