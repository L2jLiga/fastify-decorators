/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */
import 'reflect-metadata';

import { fastify, FastifyInstance } from 'fastify';
import { CLASS_LOADER, ClassLoader, Constructable, CREATOR, Registrable, Scope } from 'fastify-decorators/plugins';
import { hasServiceInjection } from '../decorators/helpers/ensure-service-injection.js';
import { classLoaderFactory } from '../decorators/helpers/inject-dependencies.js';
import { patchMethods } from '../decorators/helpers/patch-methods.js';
import { readyMap } from '../decorators/initializer.js';
import { _injectablesHolder } from '../registry/_injectables-holder.js';
import { FastifyInstanceToken, SERVICE_INJECTION } from '../symbols.js';
import { defaultScope } from '../utils/dependencies-scope-manager.js';
import { loadPlugins, Plugins } from './fastify-plugins.js';
import { MocksManager } from './mocks-manager.js';
import type { ServiceMock } from './service-mock.js';

export interface ControllerTestConfig<C> {
  controller: C;
  instance?: FastifyInstance;
  mocks?: ServiceMock[];
  plugins?: Plugins;
}

export type FastifyInstanceWithController<C> = FastifyInstance & Pick<ControllerTestConfig<C>, 'controller'>;

export async function configureControllerTest<C>(config: ControllerTestConfig<Constructable<C>>): Promise<FastifyInstanceWithController<C>> {
  const instance = config.instance ?? fastify();

  const injectablesWithMocks = MocksManager.create(_injectablesHolder, config.mocks);
  if (!injectablesWithMocks.has(FastifyInstanceToken)) {
    injectablesWithMocks.injectSingleton(FastifyInstanceToken, instance, false);
  }

  const classLoader = classLoaderFactory(injectablesWithMocks) as ClassLoader & { reset(scope: Scope): void };
  classLoader.reset(defaultScope);
  if (!instance.hasDecorator(CLASS_LOADER)) instance.decorate(CLASS_LOADER, classLoader);
  else instance[CLASS_LOADER] = classLoader;

  loadPlugins(instance, config.plugins);

  const controller = config.controller as Registrable;
  patchMethods(controller);
  const controllerInstance = await controller[CREATOR].register(instance, '');
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
