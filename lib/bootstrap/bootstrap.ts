/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import type { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { opendirSync, lstatSync, PathLike } from 'node:fs';
import type { AutoLoadConfig } from '../interfaces/bootstrap-config.js';
import { Constructable } from '../interfaces/constructable.js';
import type { BootstrapConfig } from '../interfaces/index.js';
import { hooksRegistry, Registrable } from '../plugins/index.js';
import { CREATOR } from '../symbols/index.js';
import { transformAndWait } from '../utils/transform-and-wait.js';

const defaultMask = /\.(handler|controller)\./;

export const bootstrap: FastifyPluginAsync<BootstrapConfig> = fp<BootstrapConfig>(
  async (fastify, config) => {
    await transformAndWait(hooksRegistry.appInit, (hook) => hook(fastify));

    if ('directory' in config) await transformAndWait(autoLoadModules(config), loadController.bind(fastify, config));
    if ('controllers' in config) await transformAndWait(config.controllers, loadController.bind(fastify, config));

    await transformAndWait(hooksRegistry.appReady, (hook) => hook(fastify));

    fastify.addHook('onClose', () => transformAndWait(hooksRegistry.appDestroy, (hook) => hook(fastify)));
  },
  {
    fastify: '^3.0.0 || ^4.0.0-alpha.0 || ^4.0.0-rc.0 || ^4.0.0',
    name: 'fastifyDecorators',
  },
);

function autoLoadModules(config: AutoLoadConfig): AsyncIterable<Constructable<unknown>> {
  const flags = config.mask instanceof RegExp ? config.mask.flags.replace('g', '') : '';
  const filter = config.mask ? new RegExp(config.mask, flags) : defaultMask;

  return readModulesRecursively(parsePath(config.directory), filter);
}

function parsePath(directory: PathLike): URL {
  const urlLike = directory.toString('utf8');
  const url = urlLike.startsWith('file://') ? new URL(urlLike) : new URL('file://' + urlLike);

  if (lstatSync(url).isFile()) url.pathname += './..';
  return url;
}

async function* readModulesRecursively(parentUrl: URL, filter: RegExp): AsyncIterable<Constructable<unknown>> {
  const dir = opendirSync(parentUrl);
  parentUrl.pathname += '/';

  try {
    while (true) {
      const dirent = await dir.read();
      if (dirent == null) return;

      const fullFilePath = new URL(dirent.name, parentUrl);
      if (dirent.isDirectory()) {
        yield* readModulesRecursively(fullFilePath, filter);
      } else if (filter.test(dirent.name)) {
        yield import(fullFilePath.toString()).then((m) => m.default);
      }
    }
  } finally {
    await dir.close();
  }
}

function loadController(this: FastifyInstance, config: BootstrapConfig, controller: Constructable<unknown>) {
  if (isValidController(controller)) {
    return controller[CREATOR].register(this, config.prefix);
  } else if (!config.skipBroken) {
    throw new TypeError(`Loaded file is incorrect module and can not be bootstrapped: ${controller}`);
  }
}

function isValidController(controller: Constructable<unknown>): controller is Registrable {
  return controller && CREATOR in controller;
}
