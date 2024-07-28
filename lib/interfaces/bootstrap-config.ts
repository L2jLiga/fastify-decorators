import type { PathLike } from 'node:fs';
import { ClassLoader, Constructable } from '../plugins/index.js';

/**
 * Common configuration part
 */
export interface CommonConfig {
  /**
   * Indicates whether bootstrap should fail on invalid controllers/request handlers
   * @defaultValue false
   */
  skipBroken?: boolean;

  /**
   * Defines method to create class instance
   */
  classLoader?: ClassLoader;

  /**
   * Global prefix to be applied for all routes
   */
  prefix?: string;
}

/**
 * Controllers and request handlers autoload configuration
 *
 * Accepts directory and mask to load
 * In order to work properly controllers/request handlers must be default exported
 */
export interface AutoLoadConfig extends CommonConfig {
  /**
   * Path to directory which contains files to load
   * If not specified then autoload will not be used
   *
   * @defaultValue not specified
   */
  directory: PathLike;

  /**
   * Mask used to filter files to load
   * @defaultValue /\.(handler|controller)\./
   */
  mask?: string | RegExp;
}

/**
 * Configuration contains explicitly passed controllers/request handlers to load
 */
export interface ControllersListConfig extends CommonConfig {
  /**
   * List of Controller classes to bootstrap
   */
  controllers: Constructable[];
}

export type BootstrapConfig = AutoLoadConfig | ControllersListConfig;
