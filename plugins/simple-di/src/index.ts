import 'reflect-metadata';

import { createInitializationHook } from 'fastify-decorators/plugins';
import { injectables } from './registry/injectables.js';
import { FastifyInstanceToken } from './symbols.js';
import { wrapInjectable } from './utils/wrap-injectable.js';

createInitializationHook('appInit', (fastify) => injectables.set(FastifyInstanceToken, wrapInjectable(fastify)));

export { getInstanceByToken } from './utils/get-instance-by-token.js';

export { Service } from './decorators/service.js';
export { Inject } from './decorators/inject.js';

export { Initializer } from './decorators/initializer.js';
export { Destructor } from './decorators/destructor.js';

export { FastifyInstanceToken, FastifyRequestToken, FastifyReplyToken } from './symbols.js';
