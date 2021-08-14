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
import type { AutoLoadConfig, ControllersListConfig } from '../interfaces/bootstrap-config.js';
import { Constructable } from '../interfaces/constructable.js';
import type { BootstrapConfig } from '../interfaces/index.js';
import { hooksRegistry } from '../plugins/life-cycle.js';
import { Registrable } from '../plugins/shared-interfaces.js';
import { CREATOR } from '../symbols/index.js';
import { transformAndWait } from '../utils/transform-and-wait.js';

const defaultMask = /\.(handler|controller)\./;

export const bootstrap: FastifyPluginAsync<BootstrapConfig> = fp<BootstrapConfig>(
  async (fastify, config) => {
    const controllers = new Set<Constructable<unknown>>();
    const skipBroken = config.skipBroken;

    if ('directory' in config) (await autoLoadModules(config as AutoLoadConfig)).forEach(controllers.add, controllers);
    if ('controllers' in config) (config as ControllersListConfig).controllers.forEach(controllers.add, controllers);

    await transformAndWait(controllers, (controller) => loadController(controller, fastify, { skipBroken, prefix: config.prefix }));
    await transformAndWait(hooksRegistry.appReady, (hook) => hook());

    fastify.addHook('onClose', () => transformAndWait(hooksRegistry.appDestroy, (hook) => hook()));
  },
  {
    fastify: '^3.0.0',
    name: 'fastifyDecorators',
  },
);

function autoLoadModules(config: AutoLoadConfig): Promise<Registrable[]> {
  const flags = config.mask instanceof RegExp ? config.mask.flags.replace('g', '') : '';
  const filter = config.mask ? new RegExp(config.mask, flags) : defaultMask;

  return Promise.all([...findModules(config.directory, filter)].map(loadModule));
}

function loadController(controller: Constructable<unknown>, fastify: FastifyInstance, config: Pick<BootstrapConfig, 'prefix' | 'skipBroken'>) {
  if (verifyController(controller)) {
    return controller[CREATOR].register(fastify, config.prefix);
  } else if (!config.skipBroken) {
    throw new TypeError(`Loaded file is incorrect module and can not be bootstrapped: ${controller}`);
  }
}

function verifyController(controller: Constructable<unknown>): controller is Registrable {
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
async function loadModule(module: string): Promise<Registrable> {
  if (typeof require !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require(module).__esModule ? require(module).default : require(module);
  }

  return import(pathToFileURL(module).toString()).then((m) => m.default);
}
