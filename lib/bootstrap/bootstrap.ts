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
import { promisify } from 'util';
import { BootstrapConfig } from '../interfaces';
import { injectables } from '../registry/injectables';
import { CREATOR, FastifyInstanceToken } from '../symbols';
import { wrapInjectable } from '../utils/wrap-injectable';

const readdir = promisify(fs.readdir);

const defaultMask = /\.(handler|controller)\./;

/**
 * Method which recursively scan handlers/controllers directory and bootstrap them
 */
export async function bootstrap(fastify: FastifyInstance, config: BootstrapConfig) {
    injectables.set(FastifyInstanceToken, wrapInjectable(fastify));

    for await (const module of findModules(config.directory, config.mask ? new RegExp(config.mask) : defaultMask)) {
        loadModule(module)[CREATOR].register(fastify);
    }
}

async function* findModules(path: string, filter: RegExp): AsyncIterable<string> {
    // TODO: can be replaced with for await (const filePath of fs.opendir) in Node.js >= 12.12
    for (const filePath of await readdir(path, { withFileTypes: true })) {
        const fullFilePath = join(path, filePath.name);

        if (filePath.isDirectory()) {
            yield * findModules(fullFilePath, filter);
        } else if (filter.test((filePath.name))) {
            yield fullFilePath;
        }
    }
}

function loadModule(module: string) {
    return require(module).__esModule
        ? require(module).default
        : require(module);
}
