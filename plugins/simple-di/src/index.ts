/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { CLASS_LOADER, createInitializationHook } from 'fastify-decorators/plugins';
import { classLoaderFactory } from './decorators/helpers/inject-dependencies.js';
import { patchMethods } from './decorators/helpers/patch-methods.js';
import { _injectablesHolder } from './registry/_injectables-holder.js';
import { FastifyInstanceToken } from './symbols.js';

createInitializationHook('appInit', (fastify) => {
  _injectablesHolder.injectSingleton(FastifyInstanceToken, fastify, false);
  fastify.decorate(CLASS_LOADER, classLoaderFactory(_injectablesHolder));
});
createInitializationHook('beforeControllerCreation', (fastifyInstance, target) => patchMethods(target));

export { Service } from './decorators/service.js';
export { Inject } from './decorators/inject.js';

export { Initializer } from './decorators/initializer.js';
export { Destructor } from './decorators/destructor.js';

export { FastifyInstanceToken, FastifyRequestToken, FastifyReplyToken } from './symbols.js';

export { injectablesHolder } from './registry/injectables-holder.js';
