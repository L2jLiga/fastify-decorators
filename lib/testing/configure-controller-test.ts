/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { fastify, FastifyInstance } from 'fastify';
import { hasServiceInjection } from '../decorators/helpers/class-properties.js';
import { defaultScope, DependencyScope } from '../decorators/helpers/dependency-scope.js';
import { classLoaderFactory, Constructor, ServiceInjection } from '../decorators/helpers/inject-dependencies.js';
import { readyMap } from '../decorators/index.js';
import { ClassLoader } from '../interfaces/bootstrap-config.js';
import type { InjectableController } from '../interfaces/index.js';
import type { InjectableClass } from '../interfaces/injectable-class.js';
import { _injectablesHolder } from '../registry/_injectables-holder.js';
import { CLASS_LOADER, CREATOR, FastifyInstanceToken, SERVICE_INJECTION } from '../symbols/index.js';
import { loadPlugins, Plugins } from './fastify-plugins.js';
import { MocksManager } from './mocks-manager.js';
import type { ServiceMock } from './service-mock.js';

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Reflect {
  function getMetadata(metadataKey: 'design:paramtypes', target: unknown): ServiceInjection['name'][] | undefined;
}

export interface ControllerTestConfig<C> {
  controller: C;
  instance?: FastifyInstance;
  mocks?: ServiceMock[];
  plugins?: Plugins;
}

export type FastifyInstanceWithController<C> = FastifyInstance & Pick<ControllerTestConfig<C>, 'controller'>;

export async function configureControllerTest<C>(config: ControllerTestConfig<Constructor<C>>): Promise<FastifyInstanceWithController<C>> {
  const instance = config.instance ?? fastify();
  loadPlugins(instance, config.plugins);

  const injectablesWithMocks = MocksManager.create(_injectablesHolder, config.mocks);
  if (!injectablesWithMocks.has(FastifyInstanceToken)) {
    injectablesWithMocks.injectSingleton(FastifyInstanceToken, instance, false);
  }

  const classLoader = classLoaderFactory(injectablesWithMocks) as ClassLoader & { reset(scope: DependencyScope): void };
  classLoader.reset(defaultScope);
  if (!instance.hasDecorator(CLASS_LOADER)) instance.decorate(CLASS_LOADER, classLoader);

  const controller = config.controller as InjectableController;
  const controllerInstance = await controller[CREATOR].register(instance, '', classLoader);
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

function* getInjectedProps(target: unknown): Iterable<unknown> {
  if (!hasServiceInjection(target)) return [];
  for (const value of target[SERVICE_INJECTION]) yield value.name;
}

function getConstructorArgs(constructor: InjectableClass): Array<unknown> {
  return Reflect.getMetadata('design:paramtypes', constructor) || [];
}
