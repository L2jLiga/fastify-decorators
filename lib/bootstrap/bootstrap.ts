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
import { REGISTER } from '../symbols';

const defaultMask = /\.handler\./;

export function bootstrap(fastify: FastifyInstance, config: BootstrapConfig, done: () => void) {
    const mask = new RegExp(config.handlersMask || defaultMask);

    findAllHandlers(config.handlersDirectory, mask)
        .map(require)
        .forEach(handler => handler[REGISTER](fastify));

    done();
}

function findAllHandlers(path: string, filter: RegExp): string[] {
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
