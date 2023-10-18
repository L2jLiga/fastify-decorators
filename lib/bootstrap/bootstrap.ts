/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { lstatSync, opendirSync, PathLike } from 'node:fs';
import type { AutoLoadConfig } from '../interfaces/bootstrap-config.js';
import type { BootstrapConfig } from '../interfaces/index.js';
import { CLASS_LOADER, ClassLoader, Constructable, hooksRegistry } from '../plugins/index.js';
import { CREATOR } from '../symbols/index.js';
import { transformAndWait } from '../utils/transform-and-wait.js';
import { isValidRegistrable } from '../utils/validators.js';

const defaultMask = /\.(handler|controller)\./;

export const bootstrap = fp<BootstrapConfig>(
  async (fastifyInstance: FastifyInstance, config: BootstrapConfig): Promise<void> => {
    // 1. Load all modules
    const toBootstrap = new Set<Constructable>();
    if ('directory' in config) await transformAndWait(autoLoadModules(config), toBootstrap.add.bind(toBootstrap));
    if ('controllers' in config) await transformAndWait(config.controllers, toBootstrap.add.bind(toBootstrap));

    // 2. Run appInit hooks
    await transformAndWait(hooksRegistry.appInit, (hook) => hook(fastifyInstance));

    // 3. Register default class loader in case if missing
    if (!fastifyInstance.hasDecorator(CLASS_LOADER)) {
      const classLoader: ClassLoader = config.classLoader ?? ((T) => new T());
      fastifyInstance.decorate(CLASS_LOADER, classLoader);
    } else if (config.classLoader) {
      throw new Error('Some library already defines class loader, passing custom class loader via config impossible');
    }

    // 4. Instantiate all modules
    await transformAndWait(toBootstrap, loadRegistrable.bind(fastifyInstance, config));

    // 5. Run appReady hooks
    await transformAndWait(hooksRegistry.appReady, (hook) => hook(fastifyInstance));

    // 6. Register on close hooks
    fastifyInstance.addHook('onClose', () => transformAndWait(hooksRegistry.appDestroy, (hook) => hook(fastifyInstance)));
  },
  {
    fastify: '^4.0.0',
    name: 'fastifyDecorators',
  },
);

function autoLoadModules(config: AutoLoadConfig): AsyncIterable<Constructable<unknown>> {
  const flags = config.mask instanceof RegExp ? config.mask.flags.replace('g', '') : '';
  const mask = config.mask ? new RegExp(config.mask, flags) : defaultMask;

  return readModulesRecursively(parsePath(config.directory), mask);
}

function parsePath(directory: PathLike): URL {
  const urlLike = directory.toString('utf8');
  const url = urlLike.startsWith('file://') ? new URL(urlLike) : new URL('file://' + urlLike);

  if (lstatSync(url).isFile()) url.pathname += './..';
  return url;
}

async function* readModulesRecursively(parentUrl: URL, mask: RegExp): AsyncIterable<Constructable<unknown>> {
  const dir = opendirSync(parentUrl);
  parentUrl.pathname += '/';

  try {
    while (true) {
      const dirent = await dir.read();
      if (dirent == null) return;

      const fullFilePath = new URL(dirent.name, parentUrl);
      if (dirent.isDirectory()) {
        yield* readModulesRecursively(fullFilePath, mask);
      } else if (mask.test(dirent.name)) {
        yield import(fullFilePath.toString()).then((m) => m.default);
      }
    }
  } finally {
    await dir.close();
  }
}

function loadRegistrable<T>(this: FastifyInstance, config: BootstrapConfig, constructable: Constructable<T>): Promise<void> | void {
  if (isValidRegistrable(constructable)) {
    return constructable[CREATOR].register(this, config.prefix);
  } else if (!config.skipBroken) {
    throw new TypeError(`Loaded file is incorrect module and can not be bootstrapped: ${constructable}`);
  }
}
