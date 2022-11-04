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

export { Controller } from './decorators/controller.js';
export { ControllerType } from './registry/controller-type.js';
export { ControllerConfig } from './interfaces/controller-config.js';

export { Service } from './decorators/service.js';
export { Inject } from './decorators/inject.js';
export { Initializer } from './decorators/initializer.js';
export { Destructor } from './decorators/destructor.js';
export { Hook } from './decorators/hook.js';
export { ErrorHandler } from './decorators/error-handler.js';

export { injectablesHolder } from './registry/injectables-holder.js';
export { getInstanceByToken } from './utils/get-instance-by-token.js';
export { FastifyInstanceToken, FastifyRequestToken, FastifyReplyToken } from './symbols/index.js';

export { ALL } from './decorators/request-handlers.js';
export { DELETE } from './decorators/request-handlers.js';
export { GET } from './decorators/request-handlers.js';
export { HEAD } from './decorators/request-handlers.js';
export { OPTIONS } from './decorators/request-handlers.js';
export { PATCH } from './decorators/request-handlers.js';
export { POST } from './decorators/request-handlers.js';
export { PUT } from './decorators/request-handlers.js';
export { RouteConfig } from './interfaces/route-config.js';
