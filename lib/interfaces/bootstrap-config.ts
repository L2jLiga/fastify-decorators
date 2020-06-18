/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { FastifyPluginOptions } from 'fastify';

/**
 * Config for application bootstrap
 */
export interface AutoLoadConfig extends FastifyPluginOptions {
    /**
     * Path to directory which contains files to load
     */
    directory: string;

    /**
     * Mask used to filter files to load
     * @default /\.(handler|controller)\./
     */
    mask?: string | RegExp;

    /**
     * By default application will fails to bootstrap if one or more of loaded files does not contain valid controller or handler
     * This option allows to change this behavior
     * @default false
     */
    skipBroken?: boolean;
}

export interface ControllersListConfig extends FastifyPluginOptions {
    /**
     * List of Controller classes to bootstrap
     */
    controllers: any[];

    /**
     * By default application will fails to bootstrap if one or more of loaded files does not contain valid controller or handler
     * This option allows to change this behavior
     * @default false
     */
    skipBroken?: boolean;
}

export type BootstrapConfig = AutoLoadConfig | ControllersListConfig;
