/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import type { PathLike } from 'fs';
import type { FastifyPluginOptions } from 'fastify';
import { DependencyScope } from '../Decorators/Helpers/dependency-scope.js';
import { Constructor } from '../Decorators/Helpers/inject-dependencies.js';


export type BootstrapConfig=FastifyPluginOptions&(AutoLoadConfig|ControllersListConfig)&{
  
};

/**
 * Config for application bootstrap
 */
export type AutoLoadConfig=BootstrapStaticConfig&{
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
}

export type ControllersListConfig=BootstrapStaticConfig&{
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
}

type BootstrapStaticConfig={
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

export type ClassLoader = <C>(constructor: Constructor<C>, scope?: DependencyScope) => C;

