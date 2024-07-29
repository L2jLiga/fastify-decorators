import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { lstatSync, PathLike } from 'node:fs';
import { opendir } from 'node:fs/promises';
import type { AutoLoadConfig } from '../interfaces/bootstrap-config.js';
import type { BootstrapConfig } from '../interfaces/index.js';
import { CLASS_LOADER, ClassLoader, Constructable } from '../plugins/index.js';
import { CREATOR } from '../symbols/index.js';
import { transformAndWait } from '../utils/transform-and-wait.js';
import { isValidRegistrable } from '../utils/validators.js';
import { hooksRegistry } from '../registry/hooks-registry.js';

const defaultMask = /\.(handler|controller)\./;

/**
 * Fastify plugin responsible for bootstraping
 * fastify-decorators.
 */
export const bootstrap = fp<BootstrapConfig>(
  async (fastifyInstance: FastifyInstance, config: BootstrapConfig): Promise<void> => {
    // 1. Load all modules
    const toBootstrap = new Set<Constructable>();
    if ('directory' in config) await transformAndWait(autoLoadModules(config), toBootstrap.add.bind(toBootstrap));
    if ('controllers' in config) await transformAndWait(config.controllers, toBootstrap.add.bind(toBootstrap));

    // 2. Run appInit hooks
    await transformAndWait(hooksRegistry.appInit, (hook) => hook(fastifyInstance));

    // 3. Register default class loader in case if missing
    if (!fastifyInstance.hasDecorator(CLASS_LOADER)) {
      const classLoader: ClassLoader = config.classLoader ?? ((T) => new T());
      fastifyInstance.decorate(CLASS_LOADER, classLoader);
    } else if (config.classLoader) {
      throw new Error('Some library already defines class loader, passing custom class loader via config impossible');
    }

    // 4. Instantiate all modules
    await transformAndWait(toBootstrap, loadRegistrable.bind(fastifyInstance, config));

    // 5. Run appReady hooks
    await transformAndWait(hooksRegistry.appReady, (hook) => hook(fastifyInstance));

    // 6. Register on close hooks
    fastifyInstance.addHook('onClose', () => transformAndWait(hooksRegistry.appDestroy, (hook) => hook(fastifyInstance)));
  },
  {
    fastify: '^4.0.0',
    name: 'fastifyDecorators',
  },
);

/**
 * Automatically loads modules from filesystem
 */
function autoLoadModules(config: AutoLoadConfig): AsyncIterable<Constructable<unknown>> {
  const flags = config.mask instanceof RegExp ? config.mask.flags.replace('g', '') : '';
  const mask = config.mask ? new RegExp(config.mask, flags) : defaultMask;

  return readModulesRecursively(getBaseDirOf(config.directory), mask);
}

/**
 * Function accepts anything path-like and transforms
 * it to URL object linking to the base directory.
 *
 * @example
 * ```typescript
 * parsePath(import.meta.url) // returns URL to directory containing file from which function was called
 * parsePath(__filename)      // same as above
 * parsePath(__dirname)       // converts dirname into URL
 * parsePath(process.cwd)     // converts process working directory into URL
 * ```
 */
function getBaseDirOf(pathLike: PathLike): URL {
  const urlLike = pathLike.toString('utf8');
  const url = urlLike.startsWith('file://') ? new URL(urlLike) : new URL('file://' + urlLike);

  if (lstatSync(url).isFile()) url.pathname += './..';
  return url;
}

async function* readModulesRecursively(parentUrl: URL, mask: RegExp): AsyncIterable<Constructable<unknown>> {
  for await (const dirent of await opendir(parentUrl)) {
    const fullFilePath = new URL(dirent.name, parentUrl + '/');
    if (dirent.isDirectory()) {
      yield* readModulesRecursively(fullFilePath, mask);
    } else if (mask.test(dirent.name)) {
      yield import(fullFilePath.toString()).then((m) => m.default);
    }
  }
}

function loadRegistrable<T>(this: FastifyInstance, config: BootstrapConfig, constructable: Constructable<T>): Promise<void> | void {
  if (isValidRegistrable(constructable)) {
    return constructable[CREATOR].register(this, config.prefix);
  } else if (!config.skipBroken) {
    throw new TypeError(`Loaded file is incorrect module and can not be bootstrapped: ${constructable}`);
  }
}
