/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

export { bootstrap } from './bootstrap/bootstrap';
export { BootstrapConfig } from './interfaces';
export { RequestHandler } from './interfaces';

export { Controller } from './decorators';
export { ControllerType } from './registry';
export { ControllerConfig } from './interfaces';

export { Service } from './decorators';
export { Inject } from './decorators';
export { Initializer } from './decorators';
export { Hook } from './decorators';
export { ErrorHandler } from './decorators';

export { getInstanceByToken } from './utils';
export { FastifyInstanceToken } from './symbols';

export { ALL } from './decorators';
export { DELETE } from './decorators';
export { GET } from './decorators';
export { HEAD } from './decorators';
export { OPTIONS } from './decorators';
export { PATCH } from './decorators';
export { POST } from './decorators';
export { PUT } from './decorators';
export { RouteConfig } from './interfaces';
