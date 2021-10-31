/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import 'reflect-metadata';

import { createInitializationHook } from 'fastify-decorators/plugins';
import { injectables } from '../registry/injectables.js';
import { FastifyInstanceToken } from '../symbols.js';
import { wrapInjectable } from '../utils/wrap-injectable.js';

createInitializationHook('appInit', (fastify) => injectables.set(FastifyInstanceToken, wrapInjectable(fastify)));

export type { ServiceMock } from './service-mock.js';
export { ControllerTestConfig, FastifyInstanceWithController, configureControllerTest } from './configure-controller-test.js';
export { ServiceTestConfig, configureServiceTest } from './configure-service-test.js';
