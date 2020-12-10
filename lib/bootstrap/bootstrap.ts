/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import type { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { readdirSync } from 'fs';
import { join } from 'path';
import { pathToFileURL } from 'url';
import { readyMap } from '../decorators/index.js';
import { Constructor } from '../decorators/helpers/inject-dependencies.js';
import type { BootstrapConfig, InjectableController } from '../interfaces/index.js';
import type { AutoLoadConfig, ControllersListConfig } from '../interfaces/bootstrap-config.js';
import { injectables } from '../registry/injectables.js';
import { CREATOR, FastifyInstanceToken } from '../symbols/index.js';
import { wrapInjectable } from '../utils/wrap-injectable.js';

const defaultMask = /\.(handler|controller)\./;

export const bootstrap: FastifyPluginAsync<BootstrapConfig> = fp<BootstrapConfig>(
  async (fastify, config) => {
    injectables.set(FastifyInstanceToken, wrapInjectable(fastify));
    const controllers = new Set<Constructor<unknown>>();
    const skipBroken = config.skipBroken;

    if ('directory' in config) (await autoLoadModules(config as AutoLoadConfig)).forEach(controllers.add, controllers);
    if ('controllers' in config) config.controllers.forEach(controllers.add, controllers);

    await loadControllers({ controllers: [...controllers], skipBroken }, fastify);
    await Promise.all(readyMap.values());
  },
  {
    fastify: '^3.0.0',
    name: 'fastifyDecorators',
  },
);

async function loadControllers(config: ControllersListConfig, fastify: FastifyInstance): Promise<void> {
  await Promise.all(config.controllers.map((controller) => loadController(controller, fastify, config)));
}

function autoLoadModules(config: AutoLoadConfig): Promise<InjectableController[]> {
  const flags = config.mask instanceof RegExp ? config.mask.flags.replace('g', '') : '';
  const filter = config.mask ? new RegExp(config.mask, flags) : defaultMask;

  return Promise.all([...findModules(config.directory, filter)].map(loadModule));
}

function loadController(controller: Constructor<unknown>, fastify: FastifyInstance, config: BootstrapConfig) {
  if (verifyController(controller)) {
    return controller[CREATOR].register(fastify);
  } else if (!config.skipBroken) {
    throw new TypeError(`Loaded file is incorrect module and can not be bootstrapped: ${controller}`);
  }
}

function verifyController(controller: Constructor<unknown>): controller is InjectableController {
  return controller && CREATOR in controller;
}

function* findModules(path: string, filter: RegExp): Iterable<string> {
  const directoriesToRead = new Set<string>([path]);

  for (const dirPath of directoriesToRead) {
    // TODO: can be replaced with for await (const filePath of fs.opendir) in Node.js >= 12.12
    for (const filePath of readdirSync(dirPath, { withFileTypes: true })) {
      const fullFilePath = join(dirPath, filePath.name);

      if (filePath.isDirectory()) {
        directoriesToRead.add(fullFilePath);
      } else if (filter.test(filePath.name)) {
        yield fullFilePath;
      }
    }
  }
}

/* istanbul ignore next */
async function loadModule(module: string): Promise<InjectableController> {
  if (typeof require !== 'undefined') {
    /* eslint-disable @typescript-eslint/no-var-requires */
    return require(module).__esModule ? require(module).default : require(module);
  }

  return import(pathToFileURL(module).toString()).then((m) => m.default);
}
