/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { FastifyInstance } from 'fastify';
import { readdirSync } from 'fs';
import { join } from 'path';
import { BootstrapConfig } from '../interfaces';
import { REGISTER } from '../symbols';

const defaultMask = /\.handler\./;

export function bootstrap(fastify: FastifyInstance, config: BootstrapConfig, done: () => void) {
    const mask = new RegExp(config.handlersMask || defaultMask);

    // TODO: Read directory recursively
    readdirSync(config.handlersDirectory)
        .filter(file => mask.test(file))
        .map(handlerPath => join(config.handlersDirectory, handlerPath))
        .map(require)
        .forEach(handler => handler[REGISTER](fastify));

    done();
}
