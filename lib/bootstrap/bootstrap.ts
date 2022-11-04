/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import type { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { lstatSync, PathLike, readdirSync } from 'fs';
import { fileURLToPath, URL } from 'url';
import { classLoaderFactory, Constructor } from '../decorators/helpers/inject-dependencies.js';
import { readyMap } from '../decorators/index.js';
import type { AutoLoadConfig, ClassLoader, ControllersListConfig } from '../interfaces/bootstrap-config.js';
import type { BootstrapConfig, InjectableController } from '../interfaces/index.js';
import { _injectablesHolder } from '../registry/_injectables-holder.js';
import { destructors } from '../registry/destructors.js';
import { CLASS_LOADER, CREATOR, FastifyInstanceToken } from '../symbols/index.js';

const defaultMask = /\.(handler|controller)\./;

declare module 'fastify' {
  interface FastifyInstance {
    [CLASS_LOADER]: ClassLoader;
  }
}

export const bootstrap: FastifyPluginAsync<BootstrapConfig> = fp<BootstrapConfig>(
  async (fastify, config) => {
    _injectablesHolder.injectSingleton(FastifyInstanceToken, fastify, false);
    const controllers = new Set<Constructor<unknown>>();
    const skipBroken = config.skipBroken;

    if ('directory' in config) (await autoLoadModules(config as AutoLoadConfig)).forEach(controllers.add, controllers);
    if ('controllers' in config) config.controllers.forEach(controllers.add, controllers);

    const classLoader: ClassLoader = config.classLoader ?? classLoaderFactory(_injectablesHolder, true);
    fastify.decorate(CLASS_LOADER, classLoader);

    await loadControllers({ controllers: [...controllers], skipBroken, prefix: config.prefix }, fastify);
    await Promise.all(readyMap.values());

    if (destructors.size) useGracefulShutdown(fastify);
  },
  {
    fastify: '^3.0.0 || ^4.0.0',
    name: 'fastifyDecorators',
  },
);

function autoLoadModules(config: AutoLoadConfig): Promise<InjectableController[]> {
  const flags = config.mask instanceof RegExp ? config.mask.flags.replace('g', '') : '';
  const filter = config.mask ? new RegExp(config.mask, flags) : defaultMask;

  return Promise.all([...findModules(parseDirectory(config.directory), filter)].map(loadModule));
}

function parseDirectory(directory: PathLike): URL {
  const urlLike = directory.toString('utf8');
  const url = urlLike.startsWith('file://') ? new URL(urlLike) : new URL('file://' + urlLike);

  if (lstatSync(url).isFile()) url.pathname += './..';
  return url;
}

function* findModules(rootDirUrl: URL, filter: RegExp): Iterable<URL> {
  const directoriesToRead = new Set<URL>([rootDirUrl]);

  for (const dirPath of directoriesToRead) {
    for (const filePath of readdirSync(dirPath, { withFileTypes: true })) {
      const fullFilePath = new URL(`./${filePath.name}`, dirPath.href + '/');

      if (filePath.isDirectory()) {
        fullFilePath.href += '/';
        directoriesToRead.add(fullFilePath);
      } else if (filter.test(filePath.name)) {
        yield fullFilePath;
      }
    }
  }
}

/* istanbul ignore next */
async function loadModule(moduleUrl: URL): Promise<InjectableController> {
  if (typeof require !== 'undefined') {
    const module = fileURLToPath(moduleUrl);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require(module).__esModule ? require(module).default : require(module);
  }

  return import(moduleUrl.toString()).then((m) => m.default);
}

async function loadControllers(config: ControllersListConfig, fastify: FastifyInstance): Promise<void> {
  await Promise.all(config.controllers.map((controller) => loadController(controller, fastify, config)));
}

function loadController(controller: Constructor<unknown>, fastify: FastifyInstance, config: BootstrapConfig) {
  if (verifyController(controller)) {
    return controller[CREATOR].register(fastify, config.prefix);
  } else if (!config.skipBroken) {
    throw new TypeError(`Loaded file is incorrect module and can not be bootstrapped: ${controller}`);
  }
}

function verifyController(controller: Constructor<unknown>): controller is InjectableController {
  return controller && CREATOR in controller;
}

function useGracefulShutdown(fastify: FastifyInstance): void {
  fastify.addHook('onClose', () => {
    return Promise.all([...destructors].map(([Service, property]) => fastify[CLASS_LOADER]<typeof Service>(Service)[property]()));
  });
}
