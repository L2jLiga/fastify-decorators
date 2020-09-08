/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import type { FastifyInstance } from 'fastify';
import * as fs from 'fs';
import { join } from 'path';
import { promisify } from 'util';
import { Constructor } from '../decorators/helpers/inject-dependencies';
import type { BootstrapConfig, InjectableController } from '../interfaces';
import type { AutoLoadConfig, ControllersListConfig } from '../interfaces/bootstrap-config';
import { injectables } from '../registry/injectables';
import { CREATOR, FastifyInstanceToken } from '../symbols';
import { wrapInjectable } from '../utils/wrap-injectable';

const readdir = promisify(fs.readdir);

const defaultMask = /\.(handler|controller)\./;

/**
 * Method which recursively scan handlers/controllers directory and bootstrap them
 */
export async function bootstrap(fastify: FastifyInstance, config: BootstrapConfig): Promise<void> {
    injectables.set(FastifyInstanceToken, wrapInjectable(fastify));

    if ('directory' in config) await autoLoadModules(config as AutoLoadConfig, fastify);
    if ('controllers' in config) loadControllers(config as ControllersListConfig, fastify);
}

function loadControllers(config: ControllersListConfig, fastify: FastifyInstance) {
    for (const controller of config.controllers) {
        loadController(controller, fastify, config);
    }
}

async function autoLoadModules(config: AutoLoadConfig, fastify: FastifyInstance) {
    const filter = config.mask ? new RegExp(config.mask) : defaultMask;
    for await (const module of findModules(config.directory, filter)) {
        loadController(loadModule(module), fastify, config);
    }
}

function loadController(controller: Constructor<unknown> | InjectableController, fastify: FastifyInstance, config: BootstrapConfig) {
    if (verifyController(controller)) {
        controller[CREATOR].register(fastify);
    } else if (!config.skipBroken) {
        throw new TypeError(`Loaded file is incorrect module and can not be bootstrapped: ${module}`);
    }
}

function verifyController(controller: Constructor<unknown> | InjectableController): controller is Constructor<unknown> & InjectableController {
    return controller && CREATOR in controller;
}

async function* findModules(path: string, filter: RegExp): AsyncIterable<string> {
    const directoriesToRead: string[] = [path];

    for (let dirPath = directoriesToRead.pop(); dirPath !== undefined; dirPath = directoriesToRead.pop()) {
        // TODO: can be replaced with for await (const filePath of fs.opendir) in Node.js >= 12.12
        for (const filePath of await readdir(dirPath, { withFileTypes: true })) {
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
