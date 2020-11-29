/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { fastify, FastifyInstance } from 'fastify';
import type { InjectableController } from '../interfaces';
import { injectables } from '../registry/injectables';
import { CREATOR, FastifyInstanceToken, SERVICE_INJECTION } from '../symbols';
import { MocksManager } from './mocks-manager';
import type { ServiceMock } from './service-mock';
import { readyMap } from '../decorators';
import type { InjectableClass } from '../interfaces/injectable-class';
import { ServiceInjection } from '../decorators/helpers/inject-dependencies';
import { hasServiceInjection } from '../decorators/helpers/class-properties';
import { wrapInjectable } from '../utils/wrap-injectable';

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Reflect {
  function getMetadata(metadataKey: 'design:paramtypes', target: unknown): ServiceInjection['name'][] | undefined;
}

export interface ControllerTestConfig {
  controller: any;
  mocks?: ServiceMock[];
}

export async function configureControllerTest(config: ControllerTestConfig): Promise<FastifyInstance> {
  const instance = fastify();
  const injectablesWithMocks = MocksManager.create(injectables, config.mocks);
  if (!injectablesWithMocks.has(FastifyInstanceToken)) {
    injectablesWithMocks.set(FastifyInstanceToken, wrapInjectable(instance));
  }

  const controller: InjectableController = config.controller;
  await controller[CREATOR].register(instance, injectablesWithMocks, false);

  await Promise.all(
    [...getInjectedProps(controller), ...getInjectedProps(controller.prototype), ...getConstructorArgs(controller)]
      .map((value) => injectablesWithMocks.get(value))
      .map((it) => readyMap.get(it)),
  );

  await instance.ready();

  return instance;
}

function getInjectedProps(target: unknown): Array<unknown> {
  if (!hasServiceInjection(target)) return [];
  return target[SERVICE_INJECTION].map((it) => it.name);
}

function getConstructorArgs(constructor: InjectableClass): Array<unknown> {
  return Reflect.getMetadata('design:paramtypes', constructor) || [];
}
