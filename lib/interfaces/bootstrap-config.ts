/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { RegisterOptions } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';

/**
 * Config for application bootstrap
 */
export interface BootstrapConfig<HttpServer = Server, HttpRequest = IncomingMessage, HttpResponse = ServerResponse> extends RegisterOptions<HttpServer, HttpRequest, HttpResponse> {
    /**
     * Path to directory which contains files to load
     */
    directory: string;

    /**
     * Mask used to filter files to load
     */
    mask?: string | RegExp;
}
