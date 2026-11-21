/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

export { bootstrap } from './Bootstrap/Bootstrap.js';
export {bootstrap as default} from "./Bootstrap/Bootstrap.js";
export { BootstrapConfig } from './Bootstrap/BootstrapConfig.js';
export { RequestHandler } from './Interfaces/request-handler.js';

export * from './Decorators';

export { Destructor } from './Decorators/Destructor/Destructor.js';

export { injectablesHolder } from './Registry/injectables-holder.js';
export { getInstanceByToken } from './Utils/get-instance-by-token.js';
export { FastifyInstanceToken, FastifyRequestToken, FastifyReplyToken } from './Symbols/index.js';

export { RouteConfig } from './Interfaces/route-config.js';
