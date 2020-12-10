/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { fastify, FastifyInstance, FastifyPluginAsync, FastifyPluginCallback } from 'fastify';
import type { InjectableController } from '../interfaces';
import { injectables } from '../registry/injectables';
import { CREATOR, FastifyInstanceToken, SERVICE_INJECTION } from '../symbols';
import { MocksManager } from './mocks-manager';
import type { ServiceMock } from './service-mock';
import { readyMap } from '../decorators';
import type { InjectableClass } from '../interfaces/injectable-class';
import { Constructor, ServiceInjection } from '../decorators/helpers/inject-dependencies';
import { hasServiceInjection } from '../decorators/helpers/class-properties';
import { wrapInjectable } from '../utils/wrap-injectable';
import { loadPlugins, Plugins } from './fastify-plugins';

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Reflect {
  function getMetadata(metadataKey: 'design:paramtypes', target: unknown): ServiceInjection['name'][] | undefined;
}

export interface ControllerTestConfig<C = any> {
  controller: C;
  mocks?: ServiceMock[];
  plugins?: Plugins;
}

export type FastifyInstanceWithController<C> = FastifyInstance & Pick<ControllerTestConfig<C>, 'controller'>;

export async function configureControllerTest<C>(
  config: ControllerTestConfig<Constructor<C>>,
): Promise<FastifyInstanceWithController<C>> {
  const instance = fastify();
  loadPlugins(instance, config.plugins);

  const injectablesWithMocks = MocksManager.create(injectables, config.mocks);
  if (!injectablesWithMocks.has(FastifyInstanceToken)) {
    injectablesWithMocks.set(FastifyInstanceToken, wrapInjectable(instance));
  }

  const controller = config.controller as InjectableController;
  const controllerInstance = await controller[CREATOR].register(instance, injectablesWithMocks, false);
  instance.decorate('controller', controllerInstance);

  await Promise.all(
    [...getInjectedProps(controller), ...getInjectedProps(controller.prototype), ...getConstructorArgs(controller)]
      .map((value) => injectablesWithMocks.get(value))
      .map((it) => readyMap.get(it)),
  );

  await instance.ready();

  // @ts-expect-error we have decorated instance, TypeScript can't handle it :(
  return instance;
}

function getInjectedProps(target: unknown): Array<unknown> {
  if (!hasServiceInjection(target)) return [];
  return target[SERVICE_INJECTION].map((it) => it.name);
}

function getConstructorArgs(constructor: InjectableClass): Array<unknown> {
  return Reflect.getMetadata('design:paramtypes', constructor) || [];
}
