import type { PathLike } from 'node:fs';
import { ClassLoader } from '../plugins/class-loader.js';

/**
 * Common configuration part
 */
export interface BootstrapConfig {
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
   * Path to directory which contains files to load
   * If not specified then autoload will not be used
   *
   * @defaultValue not specified
   */
  directory?: PathLike;

  /**
   * Mask used to filter files to load
   * @defaultValue /\.(handler|controller)\./
   */
  mask?: string | RegExp;

  /**
   * List of Controller classes to bootstrap
   */
  controllers?: object[];
}
