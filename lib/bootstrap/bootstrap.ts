/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { FastifyInstance } from 'fastify';
import * as fs from 'fs';
import { join } from 'path';
import { deprecate, promisify } from 'util';
import { BootstrapConfig } from '../interfaces';
import { injectables } from '../registry/injectables';
import { CREATOR, FastifyInstanceToken } from '../symbols';
import { wrapInjectable } from '../utils/wrap-injectable';

const readdir = promisify(fs.readdir);

const defaultMask = /\.(handler|controller)\./;
const message = 'controllersMask, controllersDirectory, handlersMask and handlersDirectory are deprecated, use mask and directory instead';

/**
 * Method which recursively scan handlers/controllers directory and bootstrap them
 */
export async function bootstrap(fastify: FastifyInstance, config: BootstrapConfig) {
    injectables.set(FastifyInstanceToken, wrapInjectable(fastify));

    const modules = config.directory
        ? await findAllByMask(config.directory, config.mask ? new RegExp(config.mask) : defaultMask)
        : await deprecate(deprecatedInitializer, message)(config);

    modules.map(loadModule).forEach(target => target[CREATOR].register(fastify));
}

/**
 * @deprecated
 */
async function deprecatedInitializer(config: BootstrapConfig): Promise<string[]> {
    const defaultHandlersMask = /\.handler\./;
    const defaultControllersMask = /\.controller\./;

    const handlersMask = new RegExp(config.handlersMask || defaultHandlersMask);
    const controllersMask = new RegExp(config.controllersMask || defaultControllersMask);

    const modules = [];

    if (config.handlersDirectory) modules.push(...await findAllByMask(config.handlersDirectory, handlersMask));
    if (config.controllersDirectory) modules.push(...await findAllByMask(config.controllersDirectory, controllersMask));

    return modules;
}

async function findAllByMask(path: string, filter: RegExp): Promise<string[]> {
    const files = await findAll(path);

    return files.filter(file => filter.test(file));
}

async function findAll(path: string) {
    const matches: string[] = [];

    for (const filePath of await readdir(path, { withFileTypes: true })) {
        const fullFilePath = join(path, filePath.name);

        if (filePath.isDirectory()) {
            matches.push(...await findAll(fullFilePath));

            continue;
        }

        matches.push(fullFilePath);
    }

    return matches;
}

function loadModule(module: string) {
    return require(module).__esModule
        ? require(module).default
        : require(module);
}
