/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import type { PathLike } from 'node:fs';
import { Constructable } from '../plugins/index.js';

/**
 * Config for application bootstrap
 */
export interface AutoLoadConfig {
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
   * Global prefix to be applied for all routes
   */
  prefix?: string;
}

export interface ControllersListConfig {
  /**
   * List of Controller classes to bootstrap
   */
  controllers: Constructable<unknown>[];

  /**
   * By default application will fails to bootstrap if one or more of loaded files does not contain valid controller or handler
   * This option allows to change this behavior
   * @default false
   */
  skipBroken?: boolean;

  /**
   * Global prefix to be applied for all routes
   */
  prefix?: string;
}

export type BootstrapConfig = AutoLoadConfig | ControllersListConfig;
