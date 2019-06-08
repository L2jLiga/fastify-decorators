/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { FastifyInstance } from 'fastify';
import { lstatSync, readdirSync } from 'fs';
import { join } from 'path';
import { BootstrapConfig } from '../interfaces';
import { CONTROLLER, REGISTER } from '../symbols';

const defaultHandlersMask = /\.handler\./;
const defaultControllersMask = /\.controller\./;

/**
 * Method which recursively scan handlers/controllers directory and bootstrap them
 */
export function bootstrap(fastify: FastifyInstance, config: BootstrapConfig, done: () => void) {
    const handlersMask = new RegExp(config.handlersMask || defaultHandlersMask);
    const controllersMask = new RegExp(config.controllersMask || defaultControllersMask);

    if (config.handlersDirectory)
        findAllByMask(config.handlersDirectory, handlersMask)
            .map(loadModule)
            .forEach(handler => handler[REGISTER](fastify));

    if (config.controllersDirectory)
        findAllByMask(config.controllersDirectory, controllersMask)
            .map(loadModule)
            .forEach(controller => controller[CONTROLLER].register(fastify));

    done();
}

function findAllByMask(path: string, filter: RegExp): string[] {
    const files = findAllFilesInDirectoryRecursively(path);

    return files.filter(file => filter.test(file));
}

function findAllFilesInDirectoryRecursively(path: string): string[] {
    const matches: string[] = [];

    readdirSync(path).forEach(filePath => {
        const fullFilePath = join(path, filePath);

        if (lstatSync(fullFilePath).isDirectory()) {
            matches.push(...findAllFilesInDirectoryRecursively(fullFilePath));

            return;
        }

        matches.push(fullFilePath);
    });

    return matches;
}

function loadModule(module: string) {
    return require(module).__esModule
        ? require(module).default
        : require(module);
}
