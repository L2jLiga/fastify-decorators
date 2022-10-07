/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { fastify, FastifyInstance } from 'fastify';
import { Constructable, CREATOR, Registrable } from 'fastify-decorators/plugins';
import { hasServiceInjection } from '../decorators/helpers/ensure-service-injection.js';
import { injectDependenciesIntoInstance, patchConstructable } from '../decorators/helpers/inject-dependencies.js';
import { readyMap } from '../decorators/initializer.js';
import { injectables } from '../registry/injectables.js';
import { FastifyInstanceToken, SERVICE_INJECTION } from '../symbols.js';
import { wrapInjectable } from '../utils/wrap-injectable.js';
import { loadPlugins, Plugins } from './fastify-plugins.js';
import { MocksManager } from './mocks-manager.js';
import type { ServiceMock } from './service-mock.js';

export interface ControllerTestConfig<C> {
  controller: C;
  mocks?: ServiceMock[];
  plugins?: Plugins;
}

export type FastifyInstanceWithController<C> = FastifyInstance & Pick<ControllerTestConfig<C>, 'controller'>;

export async function configureControllerTest<C>(config: ControllerTestConfig<Constructable<C>>): Promise<FastifyInstanceWithController<C>> {
  const instance = fastify();
  loadPlugins(instance, config.plugins);

  const injectablesWithMocks = MocksManager.create(injectables, config.mocks);
  if (!injectablesWithMocks.has(FastifyInstanceToken)) {
    injectablesWithMocks.set(FastifyInstanceToken, wrapInjectable(instance));
  }

  const controller = config.controller as Registrable;
  const controllerInstance = await controller[CREATOR].register(instance, '');
  patchConstructable(controller, injectablesWithMocks, false);
  injectDependenciesIntoInstance(controllerInstance, controller, injectablesWithMocks, false);
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

function getConstructorArgs(constructor: Registrable): Array<unknown> {
  return Reflect.getMetadata('design:paramtypes', constructor) || [];
}
