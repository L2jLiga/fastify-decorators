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
import { Constructor } from '../decorators/helpers/inject-dependencies';
import type { BootstrapConfig, InjectableController } from '../interfaces';
import type { AutoLoadConfig, ControllersListConfig } from '../interfaces/bootstrap-config';
import { injectables } from '../registry/injectables';
import { CREATOR, FastifyInstanceToken } from '../symbols';
import { wrapInjectable } from '../utils/wrap-injectable';
import { readyMap } from "../decorators";

const defaultMask = /\.(handler|controller)\./;

export const bootstrap: FastifyPluginAsync<BootstrapConfig> = fp<BootstrapConfig>(async (fastify, config) => {
    injectables.set(FastifyInstanceToken, wrapInjectable(fastify));
    const controllers = new Set<Constructor<unknown>>();
    const skipBroken = config.skipBroken;

    if ('directory' in config) autoLoadModules(config as AutoLoadConfig).forEach(controllers.add, controllers);
    if ('controllers' in config) config.controllers.forEach(controllers.add, controllers);

    await loadControllers({ controllers: [...controllers], skipBroken }, fastify);
    await Promise.all(readyMap.values());
}, {
    fastify: '^3.0.0',
    name: 'fastifyDecorators',
});

async function loadControllers(config: ControllersListConfig, fastify: FastifyInstance): Promise<void> {
    await Promise.all(config.controllers.map(controller => loadController(controller, fastify, config)));
}

function autoLoadModules(config: AutoLoadConfig): InjectableController[] {
    const flags = config.mask instanceof RegExp ? config.mask.flags.replace('g', '') : '';
    const filter = config.mask ? new RegExp(config.mask, flags) : defaultMask;

    return [...findModules(config.directory, filter)].map(loadModule);
}

function loadController(controller: Constructor<unknown> | InjectableController, fastify: FastifyInstance, config: BootstrapConfig) {
    if (verifyController(controller)) {
        return controller[CREATOR].register(fastify);
    } else if (!config.skipBroken) {
        throw new TypeError(`Loaded file is incorrect module and can not be bootstrapped: ${module}`);
    }
}

function verifyController(controller: Constructor<unknown> | InjectableController): controller is Constructor<unknown> & InjectableController {
    return controller && CREATOR in controller;
}

function* findModules(path: string, filter: RegExp): Iterable<string> {
    const directoriesToRead: string[] = [path];

    for (let dirPath = directoriesToRead.pop(); dirPath !== undefined; dirPath = directoriesToRead.pop()) {
        // TODO: can be replaced with for await (const filePath of fs.opendir) in Node.js >= 12.12
        for (const filePath of readdirSync(dirPath, { withFileTypes: true })) {
            const fullFilePath = join(dirPath, filePath.name);

            if (filePath.isDirectory()) {
                directoriesToRead.push(fullFilePath);
            } else if (filter.test((filePath.name))) {
                yield fullFilePath;
            }
        }
    }
}

function loadModule(module: string): InjectableController {
    /* eslint-disable @typescript-eslint/no-var-requires */
    return require(module).__esModule
        ? require(module).default
        : require(module);
}
