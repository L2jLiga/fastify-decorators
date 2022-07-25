/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import type { FastifyPluginOptions } from 'fastify';
import type { PathLike } from 'fs';
import { Constructor } from '../decorators/helpers/inject-dependencies.js';

export type ClassLoader = <C>(constructor: Constructor<C>) => C;

/**
 * Config for application bootstrap
 */
export interface AutoLoadConfig extends FastifyPluginOptions {
  /**
   * Path to directory which contains files to load
   */
  directory: PathLike;

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

  /**
   * Defines method to create class instance
   * @param constructor
   */
  classLoader?: ClassLoader;

  /**
   * Global prefix to be applied for all routes
   */
  prefix?: string;
}

export interface ControllersListConfig extends FastifyPluginOptions {
  /**
   * List of Controller classes to bootstrap
   */
  controllers: Constructor<unknown>[];

  /**
   * By default application will fails to bootstrap if one or more of loaded files does not contain valid controller or handler
   * This option allows to change this behavior
   * @default false
   */
  skipBroken?: boolean;

  /**
   * Defines method to create class instance
   * @param constructor
   */
  classLoader?: ClassLoader;

  /**
   * Global prefix to be applied for all routes
   */
  prefix?: string;
}

export type BootstrapConfig = AutoLoadConfig | ControllersListConfig;
